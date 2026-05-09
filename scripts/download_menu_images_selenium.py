import base64
import hashlib
import os
import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import Request, urlopen

from selenium import webdriver
from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


def env(name: str, default: str = "") -> str:
    value = os.getenv(name, default)
    return value.strip() if isinstance(value, str) else default


def env_int(name: str, default: int) -> int:
    try:
        return int(env(name, str(default)))
    except ValueError:
        return default


def normalize_name(value: str) -> str:
    text = re.sub(r"\s+", " ", value or "").strip().lower()
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    text = re.sub(r"[-\s]+", "_", text)
    return text.strip("_") or "menu_item"


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def guess_extension(url: str, content_type: str | None = None) -> str:
    lower = url.lower().split("?", 1)[0]
    for ext in (".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".svg"):
        if lower.endswith(ext):
            return ext
    if content_type:
        ct = content_type.split(";", 1)[0].strip().lower()
        return {
            "image/jpeg": ".jpg",
            "image/jpg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
            "image/gif": ".gif",
            "image/bmp": ".bmp",
            "image/svg+xml": ".svg",
        }.get(ct, ".bin")
    return ".bin"


def parse_data_url(data_url: str) -> tuple[bytes, str]:
    header, payload = data_url.split(",", 1)
    mime = header.split(";", 1)[0].removeprefix("data:")
    return base64.b64decode(payload), mime


def download_bytes(url: str, timeout: int) -> tuple[bytes, str | None]:
    request = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(request, timeout=timeout) as response:
        return response.read(), response.headers.get("Content-Type")


@dataclass(frozen=True)
class MenuImage:
    label: str
    image_url: str


def build_chrome_options() -> Options:
    opts = Options()
    chrome_path = env("CHROME_BINARY_PATH")
    if chrome_path:
        opts.binary_location = chrome_path

    if env("SELENIUM_HEADLESS", "1").lower() in {"1", "true", "yes", "on"}:
        opts.add_argument("--headless=new")

    opts.add_argument("--disable-notifications")
    opts.add_argument("--no-first-run")
    opts.add_argument("--no-default-browser-check")
    opts.add_argument("--start-maximized")
    return opts


def extract_css_url(value: str) -> str:
    match = re.search(r'url\(["\']?(.*?)["\']?\)', value or "", flags=re.IGNORECASE)
    return match.group(1).strip() if match else ""


def collect_menu_images(driver: webdriver.Chrome, base_url: str) -> list[MenuImage]:
    results: list[MenuImage] = []
    seen: set[str] = set()

    for img in driver.find_elements(By.TAG_NAME, "img"):
        candidate = img.get_attribute("src") or img.get_attribute("data-src") or img.get_attribute("data-lazy-src") or ""
        if not candidate:
            continue
        if candidate.startswith("data:image/"):
            results.append(MenuImage(img.get_attribute("alt") or "inline_image", candidate))
            continue
        resolved = urljoin(base_url, candidate)
        if resolved in seen:
            continue
        seen.add(resolved)
        results.append(MenuImage(img.get_attribute("alt") or img.get_attribute("aria-label") or "menu_image", resolved))

    for element in driver.find_elements(By.CSS_SELECTOR, "*"):
        bg = extract_css_url(element.value_of_css_property("background-image"))
        if not bg:
            continue
        resolved = urljoin(base_url, bg)
        if resolved in seen:
            continue
        seen.add(resolved)
        text_label = element.text.strip().splitlines()[0].strip() if element.text else ""
        label = element.get_attribute("aria-label") or element.get_attribute("title") or text_label or "background_image"
        results.append(MenuImage(label, resolved))

    return results


def unique_path(directory: Path, base_name: str, extension: str) -> Path:
    candidate = directory / f"{base_name}{extension}"
    if not candidate.exists():
        return candidate
    suffix = hashlib.sha1(base_name.encode("utf-8")).hexdigest()[:8]
    return directory / f"{base_name}_{suffix}{extension}"


def save_image(directory: Path, image: MenuImage, timeout: int) -> Path:
    safe_name = normalize_name(image.label)
    if image.image_url.startswith("data:image/"):
        payload, mime = parse_data_url(image.image_url)
        extension = guess_extension(image.image_url, mime)
        path = unique_path(directory, safe_name, extension)
        path.write_bytes(payload)
        return path

    payload, content_type = download_bytes(image.image_url, timeout)
    extension = guess_extension(image.image_url, content_type)
    path = unique_path(directory, safe_name, extension)
    path.write_bytes(payload)
    return path


def log(message: str) -> None:
    print(message, flush=True)


def main() -> int:
    source_url = env("MENU_SOURCE_URL")
    download_dir = Path(env("DOWNLOAD_DIR", str(Path.cwd() / "menu_downloads")))
    selenium_timeout = env_int("SELENIUM_TIMEOUT", 30)
    page_load_timeout = env_int("PAGE_LOAD_TIMEOUT", 60)
    wait_after_load = env_int("MENU_WAIT_SECONDS", 3)

    if not source_url:
        print("Falta MENU_SOURCE_URL", file=sys.stderr)
        return 1

    ensure_dir(download_dir)

    driver: webdriver.Chrome | None = None
    try:
        driver = webdriver.Chrome(options=build_chrome_options())
        driver.set_page_load_timeout(page_load_timeout)
        log(f"Abriendo fuente del menú: {source_url}")
        driver.get(source_url)

        if wait_after_load > 0:
            time.sleep(wait_after_load)

        try:
            WebDriverWait(driver, selenium_timeout).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        except TimeoutException:
            log("La página no completó la carga dentro del tiempo configurado, continúo con el DOM disponible.")

        images = collect_menu_images(driver, source_url)
        if not images:
            log("No se encontraron imágenes candidatas en la página.")
            return 2

        log(f"Imágenes candidatas detectadas: {len(images)}")
        success = 0
        failed = 0
        for index, image in enumerate(images, start=1):
            try:
                saved_path = save_image(download_dir, image, selenium_timeout)
                success += 1
                log(f"[{index}/{len(images)}] Guardada: {saved_path.name}")
            except Exception as exc:
                failed += 1
                log(f"[{index}/{len(images)}] Error con '{image.label}': {exc}")

        log(f"Resumen: correctas={success}, fallidas={failed}, destino={download_dir}")
        return 0 if success > 0 else 3
    except WebDriverException as exc:
        print(f"Error de Selenium: {exc}", file=sys.stderr)
        return 4
    except Exception as exc:
        print(f"Error inesperado: {exc}", file=sys.stderr)
        return 5
    finally:
        if driver is not None:
            try:
                driver.quit()
            except Exception:
                pass


if __name__ == "__main__":
    raise SystemExit(main())
