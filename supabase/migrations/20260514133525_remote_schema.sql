drop trigger if exists "trg_branch_inventory_updated_at" on "public"."branch_inventory";

drop trigger if exists "trg_branches_updated_at" on "public"."branches";

drop trigger if exists "trg_customers_updated_at" on "public"."customers";

drop trigger if exists "trg_expenses_updated_at" on "public"."expenses";

drop trigger if exists "trg_products_updated_at" on "public"."products";

drop trigger if exists "trg_purchase_order_items_updated_at" on "public"."purchase_order_items";

drop trigger if exists "trg_purchase_orders_updated_at" on "public"."purchase_orders";

drop trigger if exists "trg_service_order_checklists_updated_at" on "public"."service_order_checklists";

drop trigger if exists "trg_service_orders_updated_at" on "public"."service_orders";

drop trigger if exists "trg_service_requests_updated_at" on "public"."service_requests";

drop trigger if exists "trg_suppliers_updated_at" on "public"."suppliers";

drop trigger if exists "trg_tasks_updated_at" on "public"."tasks";

drop trigger if exists "trg_tenants_updated_at" on "public"."tenants";

drop trigger if exists "trg_users_updated_at" on "public"."users";

drop policy "branch_inventory_delete_owner_manager" on "public"."branch_inventory";

drop policy "branch_inventory_select" on "public"."branch_inventory";

drop policy "branch_inventory_update_owner_manager" on "public"."branch_inventory";

drop policy "branch_inventory_write_owner_manager" on "public"."branch_inventory";

drop policy "customers_delete_owner_manager" on "public"."customers";

drop policy "customers_select" on "public"."customers";

drop policy "customers_update_owner_manager" on "public"."customers";

drop policy "customers_write_owner_manager" on "public"."customers";

drop policy "expenses_manager_delete_own_sucursal" on "public"."expenses";

drop policy "expenses_manager_read_own_sucursal" on "public"."expenses";

drop policy "expenses_manager_update_own_sucursal" on "public"."expenses";

drop policy "expenses_manager_write_own_sucursal" on "public"."expenses";

drop policy "expenses_owner" on "public"."expenses";

drop policy "products_select" on "public"."products";

drop policy "products_write_owner_manager" on "public"."products";

drop policy "service_orders_delete_owner_manager" on "public"."service_orders";

drop policy "service_orders_select" on "public"."service_orders";

drop policy "service_orders_update_owner_manager" on "public"."service_orders";

drop policy "service_orders_update_technician" on "public"."service_orders";

drop policy "service_orders_write_owner_manager" on "public"."service_orders";

drop policy "service_requests_select" on "public"."service_requests";

drop policy "service_requests_update_owner_manager" on "public"."service_requests";

drop policy "service_requests_write_owner_manager" on "public"."service_requests";

drop policy "suppliers_select" on "public"."suppliers";

drop policy "suppliers_write_owner_manager" on "public"."suppliers";

drop policy "tasks_select" on "public"."tasks";

drop policy "tasks_write_owner_manager" on "public"."tasks";

revoke delete on table "public"."branch_inventory" from "anon";

revoke insert on table "public"."branch_inventory" from "anon";

revoke references on table "public"."branch_inventory" from "anon";

revoke select on table "public"."branch_inventory" from "anon";

revoke trigger on table "public"."branch_inventory" from "anon";

revoke truncate on table "public"."branch_inventory" from "anon";

revoke update on table "public"."branch_inventory" from "anon";

revoke delete on table "public"."branch_inventory" from "authenticated";

revoke insert on table "public"."branch_inventory" from "authenticated";

revoke references on table "public"."branch_inventory" from "authenticated";

revoke select on table "public"."branch_inventory" from "authenticated";

revoke trigger on table "public"."branch_inventory" from "authenticated";

revoke truncate on table "public"."branch_inventory" from "authenticated";

revoke update on table "public"."branch_inventory" from "authenticated";

revoke delete on table "public"."branch_inventory" from "service_role";

revoke insert on table "public"."branch_inventory" from "service_role";

revoke references on table "public"."branch_inventory" from "service_role";

revoke select on table "public"."branch_inventory" from "service_role";

revoke trigger on table "public"."branch_inventory" from "service_role";

revoke truncate on table "public"."branch_inventory" from "service_role";

revoke update on table "public"."branch_inventory" from "service_role";

revoke delete on table "public"."branches" from "anon";

revoke insert on table "public"."branches" from "anon";

revoke references on table "public"."branches" from "anon";

revoke select on table "public"."branches" from "anon";

revoke trigger on table "public"."branches" from "anon";

revoke truncate on table "public"."branches" from "anon";

revoke update on table "public"."branches" from "anon";

revoke delete on table "public"."branches" from "authenticated";

revoke insert on table "public"."branches" from "authenticated";

revoke references on table "public"."branches" from "authenticated";

revoke select on table "public"."branches" from "authenticated";

revoke trigger on table "public"."branches" from "authenticated";

revoke truncate on table "public"."branches" from "authenticated";

revoke update on table "public"."branches" from "authenticated";

revoke delete on table "public"."branches" from "service_role";

revoke insert on table "public"."branches" from "service_role";

revoke references on table "public"."branches" from "service_role";

revoke select on table "public"."branches" from "service_role";

revoke trigger on table "public"."branches" from "service_role";

revoke truncate on table "public"."branches" from "service_role";

revoke update on table "public"."branches" from "service_role";

revoke delete on table "public"."customer_payments" from "anon";

revoke insert on table "public"."customer_payments" from "anon";

revoke references on table "public"."customer_payments" from "anon";

revoke select on table "public"."customer_payments" from "anon";

revoke trigger on table "public"."customer_payments" from "anon";

revoke truncate on table "public"."customer_payments" from "anon";

revoke update on table "public"."customer_payments" from "anon";

revoke delete on table "public"."customer_payments" from "authenticated";

revoke insert on table "public"."customer_payments" from "authenticated";

revoke references on table "public"."customer_payments" from "authenticated";

revoke select on table "public"."customer_payments" from "authenticated";

revoke trigger on table "public"."customer_payments" from "authenticated";

revoke truncate on table "public"."customer_payments" from "authenticated";

revoke update on table "public"."customer_payments" from "authenticated";

revoke delete on table "public"."customer_payments" from "service_role";

revoke insert on table "public"."customer_payments" from "service_role";

revoke references on table "public"."customer_payments" from "service_role";

revoke select on table "public"."customer_payments" from "service_role";

revoke trigger on table "public"."customer_payments" from "service_role";

revoke truncate on table "public"."customer_payments" from "service_role";

revoke update on table "public"."customer_payments" from "service_role";

revoke delete on table "public"."expenses" from "anon";

revoke insert on table "public"."expenses" from "anon";

revoke references on table "public"."expenses" from "anon";

revoke select on table "public"."expenses" from "anon";

revoke trigger on table "public"."expenses" from "anon";

revoke truncate on table "public"."expenses" from "anon";

revoke update on table "public"."expenses" from "anon";

revoke delete on table "public"."expenses" from "authenticated";

revoke insert on table "public"."expenses" from "authenticated";

revoke references on table "public"."expenses" from "authenticated";

revoke select on table "public"."expenses" from "authenticated";

revoke trigger on table "public"."expenses" from "authenticated";

revoke truncate on table "public"."expenses" from "authenticated";

revoke update on table "public"."expenses" from "authenticated";

revoke delete on table "public"."expenses" from "service_role";

revoke insert on table "public"."expenses" from "service_role";

revoke references on table "public"."expenses" from "service_role";

revoke select on table "public"."expenses" from "service_role";

revoke trigger on table "public"."expenses" from "service_role";

revoke truncate on table "public"."expenses" from "service_role";

revoke update on table "public"."expenses" from "service_role";

revoke delete on table "public"."file_assets" from "anon";

revoke insert on table "public"."file_assets" from "anon";

revoke references on table "public"."file_assets" from "anon";

revoke select on table "public"."file_assets" from "anon";

revoke trigger on table "public"."file_assets" from "anon";

revoke truncate on table "public"."file_assets" from "anon";

revoke update on table "public"."file_assets" from "anon";

revoke delete on table "public"."file_assets" from "authenticated";

revoke insert on table "public"."file_assets" from "authenticated";

revoke references on table "public"."file_assets" from "authenticated";

revoke select on table "public"."file_assets" from "authenticated";

revoke trigger on table "public"."file_assets" from "authenticated";

revoke truncate on table "public"."file_assets" from "authenticated";

revoke update on table "public"."file_assets" from "authenticated";

revoke delete on table "public"."file_assets" from "service_role";

revoke insert on table "public"."file_assets" from "service_role";

revoke references on table "public"."file_assets" from "service_role";

revoke select on table "public"."file_assets" from "service_role";

revoke trigger on table "public"."file_assets" from "service_role";

revoke truncate on table "public"."file_assets" from "service_role";

revoke update on table "public"."file_assets" from "service_role";

revoke delete on table "public"."inventory_movements" from "anon";

revoke insert on table "public"."inventory_movements" from "anon";

revoke references on table "public"."inventory_movements" from "anon";

revoke select on table "public"."inventory_movements" from "anon";

revoke trigger on table "public"."inventory_movements" from "anon";

revoke truncate on table "public"."inventory_movements" from "anon";

revoke update on table "public"."inventory_movements" from "anon";

revoke delete on table "public"."inventory_movements" from "authenticated";

revoke insert on table "public"."inventory_movements" from "authenticated";

revoke references on table "public"."inventory_movements" from "authenticated";

revoke select on table "public"."inventory_movements" from "authenticated";

revoke trigger on table "public"."inventory_movements" from "authenticated";

revoke truncate on table "public"."inventory_movements" from "authenticated";

revoke update on table "public"."inventory_movements" from "authenticated";

revoke delete on table "public"."inventory_movements" from "service_role";

revoke insert on table "public"."inventory_movements" from "service_role";

revoke references on table "public"."inventory_movements" from "service_role";

revoke select on table "public"."inventory_movements" from "service_role";

revoke trigger on table "public"."inventory_movements" from "service_role";

revoke truncate on table "public"."inventory_movements" from "service_role";

revoke update on table "public"."inventory_movements" from "service_role";

revoke delete on table "public"."notification_events" from "anon";

revoke insert on table "public"."notification_events" from "anon";

revoke references on table "public"."notification_events" from "anon";

revoke select on table "public"."notification_events" from "anon";

revoke trigger on table "public"."notification_events" from "anon";

revoke truncate on table "public"."notification_events" from "anon";

revoke update on table "public"."notification_events" from "anon";

revoke delete on table "public"."notification_events" from "authenticated";

revoke insert on table "public"."notification_events" from "authenticated";

revoke references on table "public"."notification_events" from "authenticated";

revoke select on table "public"."notification_events" from "authenticated";

revoke trigger on table "public"."notification_events" from "authenticated";

revoke truncate on table "public"."notification_events" from "authenticated";

revoke update on table "public"."notification_events" from "authenticated";

revoke delete on table "public"."notification_events" from "service_role";

revoke insert on table "public"."notification_events" from "service_role";

revoke references on table "public"."notification_events" from "service_role";

revoke select on table "public"."notification_events" from "service_role";

revoke trigger on table "public"."notification_events" from "service_role";

revoke truncate on table "public"."notification_events" from "service_role";

revoke update on table "public"."notification_events" from "service_role";

revoke delete on table "public"."products" from "anon";

revoke insert on table "public"."products" from "anon";

revoke references on table "public"."products" from "anon";

revoke select on table "public"."products" from "anon";

revoke trigger on table "public"."products" from "anon";

revoke truncate on table "public"."products" from "anon";

revoke update on table "public"."products" from "anon";

revoke delete on table "public"."products" from "authenticated";

revoke insert on table "public"."products" from "authenticated";

revoke references on table "public"."products" from "authenticated";

revoke select on table "public"."products" from "authenticated";

revoke trigger on table "public"."products" from "authenticated";

revoke truncate on table "public"."products" from "authenticated";

revoke update on table "public"."products" from "authenticated";

revoke delete on table "public"."products" from "service_role";

revoke insert on table "public"."products" from "service_role";

revoke references on table "public"."products" from "service_role";

revoke select on table "public"."products" from "service_role";

revoke trigger on table "public"."products" from "service_role";

revoke truncate on table "public"."products" from "service_role";

revoke update on table "public"."products" from "service_role";

revoke delete on table "public"."purchase_order_items" from "anon";

revoke insert on table "public"."purchase_order_items" from "anon";

revoke references on table "public"."purchase_order_items" from "anon";

revoke select on table "public"."purchase_order_items" from "anon";

revoke trigger on table "public"."purchase_order_items" from "anon";

revoke truncate on table "public"."purchase_order_items" from "anon";

revoke update on table "public"."purchase_order_items" from "anon";

revoke delete on table "public"."purchase_order_items" from "authenticated";

revoke insert on table "public"."purchase_order_items" from "authenticated";

revoke references on table "public"."purchase_order_items" from "authenticated";

revoke select on table "public"."purchase_order_items" from "authenticated";

revoke trigger on table "public"."purchase_order_items" from "authenticated";

revoke truncate on table "public"."purchase_order_items" from "authenticated";

revoke update on table "public"."purchase_order_items" from "authenticated";

revoke delete on table "public"."purchase_order_items" from "service_role";

revoke insert on table "public"."purchase_order_items" from "service_role";

revoke references on table "public"."purchase_order_items" from "service_role";

revoke select on table "public"."purchase_order_items" from "service_role";

revoke trigger on table "public"."purchase_order_items" from "service_role";

revoke truncate on table "public"."purchase_order_items" from "service_role";

revoke update on table "public"."purchase_order_items" from "service_role";

revoke delete on table "public"."purchase_orders" from "anon";

revoke insert on table "public"."purchase_orders" from "anon";

revoke references on table "public"."purchase_orders" from "anon";

revoke select on table "public"."purchase_orders" from "anon";

revoke trigger on table "public"."purchase_orders" from "anon";

revoke truncate on table "public"."purchase_orders" from "anon";

revoke update on table "public"."purchase_orders" from "anon";

revoke delete on table "public"."purchase_orders" from "authenticated";

revoke insert on table "public"."purchase_orders" from "authenticated";

revoke references on table "public"."purchase_orders" from "authenticated";

revoke select on table "public"."purchase_orders" from "authenticated";

revoke trigger on table "public"."purchase_orders" from "authenticated";

revoke truncate on table "public"."purchase_orders" from "authenticated";

revoke update on table "public"."purchase_orders" from "authenticated";

revoke delete on table "public"."purchase_orders" from "service_role";

revoke insert on table "public"."purchase_orders" from "service_role";

revoke references on table "public"."purchase_orders" from "service_role";

revoke select on table "public"."purchase_orders" from "service_role";

revoke trigger on table "public"."purchase_orders" from "service_role";

revoke truncate on table "public"."purchase_orders" from "service_role";

revoke update on table "public"."purchase_orders" from "service_role";

revoke delete on table "public"."service_order_checklists" from "anon";

revoke insert on table "public"."service_order_checklists" from "anon";

revoke references on table "public"."service_order_checklists" from "anon";

revoke select on table "public"."service_order_checklists" from "anon";

revoke trigger on table "public"."service_order_checklists" from "anon";

revoke truncate on table "public"."service_order_checklists" from "anon";

revoke update on table "public"."service_order_checklists" from "anon";

revoke delete on table "public"."service_order_checklists" from "authenticated";

revoke insert on table "public"."service_order_checklists" from "authenticated";

revoke references on table "public"."service_order_checklists" from "authenticated";

revoke select on table "public"."service_order_checklists" from "authenticated";

revoke trigger on table "public"."service_order_checklists" from "authenticated";

revoke truncate on table "public"."service_order_checklists" from "authenticated";

revoke update on table "public"."service_order_checklists" from "authenticated";

revoke delete on table "public"."service_order_checklists" from "service_role";

revoke insert on table "public"."service_order_checklists" from "service_role";

revoke references on table "public"."service_order_checklists" from "service_role";

revoke select on table "public"."service_order_checklists" from "service_role";

revoke trigger on table "public"."service_order_checklists" from "service_role";

revoke truncate on table "public"."service_order_checklists" from "service_role";

revoke update on table "public"."service_order_checklists" from "service_role";

revoke delete on table "public"."service_order_status_history" from "anon";

revoke insert on table "public"."service_order_status_history" from "anon";

revoke references on table "public"."service_order_status_history" from "anon";

revoke select on table "public"."service_order_status_history" from "anon";

revoke trigger on table "public"."service_order_status_history" from "anon";

revoke truncate on table "public"."service_order_status_history" from "anon";

revoke update on table "public"."service_order_status_history" from "anon";

revoke delete on table "public"."service_order_status_history" from "authenticated";

revoke insert on table "public"."service_order_status_history" from "authenticated";

revoke references on table "public"."service_order_status_history" from "authenticated";

revoke select on table "public"."service_order_status_history" from "authenticated";

revoke trigger on table "public"."service_order_status_history" from "authenticated";

revoke truncate on table "public"."service_order_status_history" from "authenticated";

revoke update on table "public"."service_order_status_history" from "authenticated";

revoke delete on table "public"."service_order_status_history" from "service_role";

revoke insert on table "public"."service_order_status_history" from "service_role";

revoke references on table "public"."service_order_status_history" from "service_role";

revoke select on table "public"."service_order_status_history" from "service_role";

revoke trigger on table "public"."service_order_status_history" from "service_role";

revoke truncate on table "public"."service_order_status_history" from "service_role";

revoke update on table "public"."service_order_status_history" from "service_role";

revoke delete on table "public"."service_requests" from "anon";

revoke insert on table "public"."service_requests" from "anon";

revoke references on table "public"."service_requests" from "anon";

revoke select on table "public"."service_requests" from "anon";

revoke trigger on table "public"."service_requests" from "anon";

revoke truncate on table "public"."service_requests" from "anon";

revoke update on table "public"."service_requests" from "anon";

revoke delete on table "public"."service_requests" from "authenticated";

revoke insert on table "public"."service_requests" from "authenticated";

revoke references on table "public"."service_requests" from "authenticated";

revoke select on table "public"."service_requests" from "authenticated";

revoke trigger on table "public"."service_requests" from "authenticated";

revoke truncate on table "public"."service_requests" from "authenticated";

revoke update on table "public"."service_requests" from "authenticated";

revoke delete on table "public"."service_requests" from "service_role";

revoke insert on table "public"."service_requests" from "service_role";

revoke references on table "public"."service_requests" from "service_role";

revoke select on table "public"."service_requests" from "service_role";

revoke trigger on table "public"."service_requests" from "service_role";

revoke truncate on table "public"."service_requests" from "service_role";

revoke update on table "public"."service_requests" from "service_role";

revoke delete on table "public"."stock_alerts" from "anon";

revoke insert on table "public"."stock_alerts" from "anon";

revoke references on table "public"."stock_alerts" from "anon";

revoke select on table "public"."stock_alerts" from "anon";

revoke trigger on table "public"."stock_alerts" from "anon";

revoke truncate on table "public"."stock_alerts" from "anon";

revoke update on table "public"."stock_alerts" from "anon";

revoke delete on table "public"."stock_alerts" from "authenticated";

revoke insert on table "public"."stock_alerts" from "authenticated";

revoke references on table "public"."stock_alerts" from "authenticated";

revoke select on table "public"."stock_alerts" from "authenticated";

revoke trigger on table "public"."stock_alerts" from "authenticated";

revoke truncate on table "public"."stock_alerts" from "authenticated";

revoke update on table "public"."stock_alerts" from "authenticated";

revoke delete on table "public"."stock_alerts" from "service_role";

revoke insert on table "public"."stock_alerts" from "service_role";

revoke references on table "public"."stock_alerts" from "service_role";

revoke select on table "public"."stock_alerts" from "service_role";

revoke trigger on table "public"."stock_alerts" from "service_role";

revoke truncate on table "public"."stock_alerts" from "service_role";

revoke update on table "public"."stock_alerts" from "service_role";

revoke delete on table "public"."suppliers" from "anon";

revoke insert on table "public"."suppliers" from "anon";

revoke references on table "public"."suppliers" from "anon";

revoke select on table "public"."suppliers" from "anon";

revoke trigger on table "public"."suppliers" from "anon";

revoke truncate on table "public"."suppliers" from "anon";

revoke update on table "public"."suppliers" from "anon";

revoke delete on table "public"."suppliers" from "authenticated";

revoke insert on table "public"."suppliers" from "authenticated";

revoke references on table "public"."suppliers" from "authenticated";

revoke select on table "public"."suppliers" from "authenticated";

revoke trigger on table "public"."suppliers" from "authenticated";

revoke truncate on table "public"."suppliers" from "authenticated";

revoke update on table "public"."suppliers" from "authenticated";

revoke delete on table "public"."suppliers" from "service_role";

revoke insert on table "public"."suppliers" from "service_role";

revoke references on table "public"."suppliers" from "service_role";

revoke select on table "public"."suppliers" from "service_role";

revoke trigger on table "public"."suppliers" from "service_role";

revoke truncate on table "public"."suppliers" from "service_role";

revoke update on table "public"."suppliers" from "service_role";

revoke delete on table "public"."task_history" from "anon";

revoke insert on table "public"."task_history" from "anon";

revoke references on table "public"."task_history" from "anon";

revoke select on table "public"."task_history" from "anon";

revoke trigger on table "public"."task_history" from "anon";

revoke truncate on table "public"."task_history" from "anon";

revoke update on table "public"."task_history" from "anon";

revoke delete on table "public"."task_history" from "authenticated";

revoke insert on table "public"."task_history" from "authenticated";

revoke references on table "public"."task_history" from "authenticated";

revoke select on table "public"."task_history" from "authenticated";

revoke trigger on table "public"."task_history" from "authenticated";

revoke truncate on table "public"."task_history" from "authenticated";

revoke update on table "public"."task_history" from "authenticated";

revoke delete on table "public"."task_history" from "service_role";

revoke insert on table "public"."task_history" from "service_role";

revoke references on table "public"."task_history" from "service_role";

revoke select on table "public"."task_history" from "service_role";

revoke trigger on table "public"."task_history" from "service_role";

revoke truncate on table "public"."task_history" from "service_role";

revoke update on table "public"."task_history" from "service_role";

revoke delete on table "public"."tasks" from "anon";

revoke insert on table "public"."tasks" from "anon";

revoke references on table "public"."tasks" from "anon";

revoke select on table "public"."tasks" from "anon";

revoke trigger on table "public"."tasks" from "anon";

revoke truncate on table "public"."tasks" from "anon";

revoke update on table "public"."tasks" from "anon";

revoke delete on table "public"."tasks" from "authenticated";

revoke insert on table "public"."tasks" from "authenticated";

revoke references on table "public"."tasks" from "authenticated";

revoke select on table "public"."tasks" from "authenticated";

revoke trigger on table "public"."tasks" from "authenticated";

revoke truncate on table "public"."tasks" from "authenticated";

revoke update on table "public"."tasks" from "authenticated";

revoke delete on table "public"."tasks" from "service_role";

revoke insert on table "public"."tasks" from "service_role";

revoke references on table "public"."tasks" from "service_role";

revoke select on table "public"."tasks" from "service_role";

revoke trigger on table "public"."tasks" from "service_role";

revoke truncate on table "public"."tasks" from "service_role";

revoke update on table "public"."tasks" from "service_role";

revoke delete on table "public"."users" from "anon";

revoke insert on table "public"."users" from "anon";

revoke references on table "public"."users" from "anon";

revoke select on table "public"."users" from "anon";

revoke trigger on table "public"."users" from "anon";

revoke truncate on table "public"."users" from "anon";

revoke update on table "public"."users" from "anon";

revoke delete on table "public"."users" from "authenticated";

revoke insert on table "public"."users" from "authenticated";

revoke references on table "public"."users" from "authenticated";

revoke select on table "public"."users" from "authenticated";

revoke trigger on table "public"."users" from "authenticated";

revoke truncate on table "public"."users" from "authenticated";

revoke update on table "public"."users" from "authenticated";

revoke delete on table "public"."users" from "service_role";

revoke insert on table "public"."users" from "service_role";

revoke references on table "public"."users" from "service_role";

revoke select on table "public"."users" from "service_role";

revoke trigger on table "public"."users" from "service_role";

revoke truncate on table "public"."users" from "service_role";

revoke update on table "public"."users" from "service_role";

alter table "public"."branch_inventory" drop constraint "branch_inventory_branch_id_fkey";

alter table "public"."branch_inventory" drop constraint "branch_inventory_product_id_fkey";

alter table "public"."branch_inventory" drop constraint "branch_inventory_tenant_id_fkey";

alter table "public"."branches" drop constraint "branches_tenant_id_fkey";

alter table "public"."customer_payments" drop constraint "customer_payments_branch_id_fkey";

alter table "public"."customer_payments" drop constraint "customer_payments_created_by_fkey";

alter table "public"."customer_payments" drop constraint "customer_payments_customer_id_fkey";

alter table "public"."customer_payments" drop constraint "customer_payments_service_order_id_fkey";

alter table "public"."customer_payments" drop constraint "customer_payments_service_request_id_fkey";

alter table "public"."customer_payments" drop constraint "customer_payments_tenant_id_fkey";

alter table "public"."expenses" drop constraint "expenses_branch_id_fkey";

alter table "public"."expenses" drop constraint "expenses_created_by_fkey";

alter table "public"."expenses" drop constraint "expenses_purchase_order_id_fkey";

alter table "public"."expenses" drop constraint "expenses_service_order_id_fkey";

alter table "public"."expenses" drop constraint "expenses_supplier_id_fkey";

alter table "public"."expenses" drop constraint "expenses_tenant_id_fkey";

alter table "public"."file_assets" drop constraint "file_assets_branch_id_fkey";

alter table "public"."file_assets" drop constraint "file_assets_service_order_id_fkey";

alter table "public"."file_assets" drop constraint "file_assets_service_request_id_fkey";

alter table "public"."file_assets" drop constraint "file_assets_tenant_id_fkey";

alter table "public"."file_assets" drop constraint "file_assets_uploaded_by_fkey";

alter table "public"."inventory_movements" drop constraint "inventory_movements_branch_id_fkey";

alter table "public"."inventory_movements" drop constraint "inventory_movements_created_by_fkey";

alter table "public"."inventory_movements" drop constraint "inventory_movements_product_id_fkey";

alter table "public"."inventory_movements" drop constraint "inventory_movements_purchase_order_id_fkey";

alter table "public"."inventory_movements" drop constraint "inventory_movements_service_order_id_fkey";

alter table "public"."inventory_movements" drop constraint "inventory_movements_tenant_id_fkey";

alter table "public"."notification_events" drop constraint "notification_events_tenant_id_fkey";

alter table "public"."products" drop constraint "products_primary_supplier_id_fkey";

alter table "public"."products" drop constraint "products_tenant_id_fkey";

alter table "public"."purchase_order_items" drop constraint "purchase_order_items_product_id_fkey";

alter table "public"."purchase_order_items" drop constraint "purchase_order_items_purchase_order_id_fkey";

alter table "public"."purchase_order_items" drop constraint "purchase_order_items_tenant_id_fkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_branch_id_fkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_created_by_fkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_related_service_order_id_fkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_supplier_id_fkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_tenant_id_fkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_updated_by_fkey";

alter table "public"."service_order_checklists" drop constraint "service_order_checklists_service_order_id_fkey";

alter table "public"."service_order_checklists" drop constraint "service_order_checklists_tenant_id_fkey";

alter table "public"."service_order_status_history" drop constraint "service_order_status_history_changed_by_fkey";

alter table "public"."service_order_status_history" drop constraint "service_order_status_history_service_order_id_fkey";

alter table "public"."service_order_status_history" drop constraint "service_order_status_history_tenant_id_fkey";

alter table "public"."service_orders" drop constraint "service_orders_branch_id_fkey";

alter table "public"."service_orders" drop constraint "service_orders_created_by_fkey";

alter table "public"."service_orders" drop constraint "service_orders_service_request_id_fkey";

alter table "public"."service_orders" drop constraint "service_orders_updated_by_fkey";

alter table "public"."service_requests" drop constraint "service_requests_branch_id_fkey";

alter table "public"."service_requests" drop constraint "service_requests_tenant_id_fkey";

alter table "public"."stock_alerts" drop constraint "stock_alerts_acknowledged_by_fkey";

alter table "public"."stock_alerts" drop constraint "stock_alerts_branch_id_fkey";

alter table "public"."stock_alerts" drop constraint "stock_alerts_product_id_fkey";

alter table "public"."stock_alerts" drop constraint "stock_alerts_tenant_id_fkey";

alter table "public"."suppliers" drop constraint "suppliers_tenant_id_fkey";

alter table "public"."task_history" drop constraint "task_history_changed_by_fkey";

alter table "public"."task_history" drop constraint "task_history_task_id_fkey";

alter table "public"."task_history" drop constraint "task_history_tenant_id_fkey";

alter table "public"."tasks" drop constraint "tasks_assigned_user_id_fkey";

alter table "public"."tasks" drop constraint "tasks_branch_id_fkey";

alter table "public"."tasks" drop constraint "tasks_created_by_fkey";

alter table "public"."tasks" drop constraint "tasks_service_order_id_fkey";

alter table "public"."tasks" drop constraint "tasks_service_request_id_fkey";

alter table "public"."tasks" drop constraint "tasks_tenant_id_fkey";

alter table "public"."tasks" drop constraint "tasks_updated_by_fkey";

alter table "public"."users" drop constraint "users_branch_id_fkey";

alter table "public"."users" drop constraint "users_tenant_id_fkey";

alter table "public"."customers" drop constraint "customers_tenant_id_fkey";

alter table "public"."service_orders" drop constraint "service_orders_customer_id_fkey";

alter table "public"."service_orders" drop constraint "service_orders_tenant_id_fkey";

drop function if exists "public"."set_updated_at"();

alter table "public"."branch_inventory" drop constraint "branch_inventory_pkey";

alter table "public"."branches" drop constraint "branches_pkey";

alter table "public"."customer_payments" drop constraint "customer_payments_pkey";

alter table "public"."expenses" drop constraint "expenses_pkey";

alter table "public"."file_assets" drop constraint "file_assets_pkey";

alter table "public"."inventory_movements" drop constraint "inventory_movements_pkey";

alter table "public"."notification_events" drop constraint "notification_events_pkey";

alter table "public"."products" drop constraint "products_pkey";

alter table "public"."purchase_order_items" drop constraint "purchase_order_items_pkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_pkey";

alter table "public"."service_order_checklists" drop constraint "service_order_checklists_pkey";

alter table "public"."service_order_status_history" drop constraint "service_order_status_history_pkey";

alter table "public"."service_requests" drop constraint "service_requests_pkey";

alter table "public"."stock_alerts" drop constraint "stock_alerts_pkey";

alter table "public"."suppliers" drop constraint "suppliers_pkey";

alter table "public"."task_history" drop constraint "task_history_pkey";

alter table "public"."tasks" drop constraint "tasks_pkey";

alter table "public"."users" drop constraint "users_pkey";

drop index if exists "public"."branch_inventory_pkey";

drop index if exists "public"."branch_inventory_uidx";

drop index if exists "public"."branches_pkey";

drop index if exists "public"."branches_tenant_code_uidx";

drop index if exists "public"."customer_payments_pkey";

drop index if exists "public"."customers_tenant_email_idx";

drop index if exists "public"."customers_tenant_idx";

drop index if exists "public"."customers_tenant_phone_idx";

drop index if exists "public"."expenses_pkey";

drop index if exists "public"."expenses_tenant_date_idx";

drop index if exists "public"."file_assets_pkey";

drop index if exists "public"."inventory_movements_pkey";

drop index if exists "public"."inventory_movements_tenant_product_idx";

drop index if exists "public"."notification_events_pkey";

drop index if exists "public"."products_pkey";

drop index if exists "public"."products_tenant_sku_uidx";

drop index if exists "public"."purchase_order_items_pkey";

drop index if exists "public"."purchase_orders_pkey";

drop index if exists "public"."purchase_orders_tenant_folio_uidx";

drop index if exists "public"."service_order_checklists_order_uidx";

drop index if exists "public"."service_order_checklists_pkey";

drop index if exists "public"."service_order_status_history_order_idx";

drop index if exists "public"."service_order_status_history_pkey";

drop index if exists "public"."service_orders_tenant_branch_idx";

drop index if exists "public"."service_orders_tenant_folio_uidx";

drop index if exists "public"."service_orders_tenant_status_idx";

drop index if exists "public"."service_requests_pkey";

drop index if exists "public"."service_requests_tenant_folio_uidx";

drop index if exists "public"."stock_alerts_pkey";

drop index if exists "public"."suppliers_pkey";

drop index if exists "public"."suppliers_tenant_idx";

drop index if exists "public"."task_history_pkey";

drop index if exists "public"."tasks_assigned_idx";

drop index if exists "public"."tasks_pkey";

drop index if exists "public"."tasks_tenant_branch_idx";

drop index if exists "public"."tasks_tenant_status_idx";

drop index if exists "public"."users_pkey";

drop index if exists "public"."users_tenant_email_uidx";

drop table "public"."branch_inventory";

drop table "public"."branches";

drop table "public"."customer_payments";

drop table "public"."expenses";

drop table "public"."file_assets";

drop table "public"."inventory_movements";

drop table "public"."notification_events";

drop table "public"."products";

drop table "public"."purchase_order_items";

drop table "public"."purchase_orders";

drop table "public"."service_order_checklists";

drop table "public"."service_order_status_history";

drop table "public"."service_requests";

drop table "public"."stock_alerts";

drop table "public"."suppliers";

drop table "public"."task_history";

drop table "public"."tasks";

drop table "public"."users";


  create table "public"."organizations" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" text not null,
    "slug" text not null,
    "subscription_status" text default 'trial'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."organizations" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "email" text not null,
    "full_name" text,
    "organization_id" uuid,
    "role" text default 'tech'::text,
    "active" boolean default true,
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."profiles" enable row level security;

alter table "public"."customers" drop column "full_name";

alter table "public"."customers" drop column "is_active";

alter table "public"."customers" drop column "notes";

alter table "public"."customers" drop column "tag";

alter table "public"."customers" drop column "updated_at";

alter table "public"."customers" add column "name" text not null;

alter table "public"."customers" alter column "created_at" set default now();

alter table "public"."customers" alter column "created_at" drop not null;

alter table "public"."customers" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."service_orders" drop column "archived_at";

alter table "public"."service_orders" drop column "branch_id";

alter table "public"."service_orders" drop column "caso_resolucion_tecnica";

alter table "public"."service_orders" drop column "completed_at";

alter table "public"."service_orders" drop column "created_by";

alter table "public"."service_orders" drop column "delivered_at";

alter table "public"."service_orders" drop column "device_brand";

alter table "public"."service_orders" drop column "device_model";

alter table "public"."service_orders" drop column "device_type";

alter table "public"."service_orders" drop column "estimated_cost";

alter table "public"."service_orders" drop column "final_cost";

alter table "public"."service_orders" drop column "folio";

alter table "public"."service_orders" drop column "internal_diagnosis";

alter table "public"."service_orders" drop column "priority";

alter table "public"."service_orders" drop column "promised_date";

alter table "public"."service_orders" drop column "received_at";

alter table "public"."service_orders" drop column "reported_issue";

alter table "public"."service_orders" drop column "service_request_id";

alter table "public"."service_orders" drop column "updated_at";

alter table "public"."service_orders" drop column "updated_by";

alter table "public"."service_orders" add column "accessories" text;

alter table "public"."service_orders" add column "device_info" jsonb not null;

alter table "public"."service_orders" add column "evidence_metadata" jsonb default '[]'::jsonb;

alter table "public"."service_orders" add column "internal_notes" text;

alter table "public"."service_orders" add column "problem_description" text not null;

alter table "public"."service_orders" add column "total_cost" numeric(12,2) default 0;

alter table "public"."service_orders" add column "warranty_until" timestamp with time zone;

alter table "public"."service_orders" alter column "created_at" set default now();

alter table "public"."service_orders" alter column "created_at" drop not null;

alter table "public"."service_orders" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."service_orders" alter column "status" set default 'pending'::text;

alter table "public"."service_orders" alter column "status" drop not null;

alter table "public"."tenants" drop column "contact_email";

alter table "public"."tenants" drop column "contact_name";

alter table "public"."tenants" drop column "contact_phone";

alter table "public"."tenants" drop column "plan";

alter table "public"."tenants" drop column "status";

alter table "public"."tenants" drop column "updated_at";

alter table "public"."tenants" add column "billing_exempt" boolean not null default false;

alter table "public"."tenants" alter column "created_at" set default now();

alter table "public"."tenants" enable row level security;

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);

CREATE UNIQUE INDEX organizations_slug_key ON public.organizations USING btree (slug);

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."organizations" add constraint "organizations_slug_key" UNIQUE using index "organizations_slug_key";

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) not valid;

alter table "public"."profiles" validate constraint "profiles_organization_id_fkey";

alter table "public"."profiles" add constraint "profiles_role_check" CHECK ((role = ANY (ARRAY['owner'::text, 'admin'::text, 'tech'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_role_check";

alter table "public"."service_orders" add constraint "check_device_info_structure" CHECK (((device_info ? 'brand'::text) AND (device_info ? 'model'::text))) not valid;

alter table "public"."service_orders" validate constraint "check_device_info_structure";

alter table "public"."service_orders" add constraint "service_orders_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'diagnosing'::text, 'waiting_parts'::text, 'ready'::text, 'delivered'::text, 'cancelled'::text]))) not valid;

alter table "public"."service_orders" validate constraint "service_orders_status_check";

alter table "public"."service_orders" add constraint "service_orders_total_cost_check" CHECK ((total_cost >= (0)::numeric)) not valid;

alter table "public"."service_orders" validate constraint "service_orders_total_cost_check";

alter table "public"."customers" add constraint "customers_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."customers" validate constraint "customers_tenant_id_fkey";

alter table "public"."service_orders" add constraint "service_orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."service_orders" validate constraint "service_orders_customer_id_fkey";

alter table "public"."service_orders" add constraint "service_orders_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."service_orders" validate constraint "service_orders_tenant_id_fkey";

create or replace view "public"."view_service_orders_detail" as  SELECT so.id,
    so.created_at,
    so.status,
    (so.device_info ->> 'brand'::text) AS brand,
    (so.device_info ->> 'model'::text) AS model,
    so.total_cost,
    c.name AS customer_name,
    c.phone AS customer_phone,
    so.tenant_id
   FROM (public.service_orders so
     LEFT JOIN public.customers c ON ((so.customer_id = c.id)));


grant delete on table "public"."organizations" to "anon";

grant insert on table "public"."organizations" to "anon";

grant references on table "public"."organizations" to "anon";

grant select on table "public"."organizations" to "anon";

grant trigger on table "public"."organizations" to "anon";

grant truncate on table "public"."organizations" to "anon";

grant update on table "public"."organizations" to "anon";

grant delete on table "public"."organizations" to "authenticated";

grant insert on table "public"."organizations" to "authenticated";

grant references on table "public"."organizations" to "authenticated";

grant select on table "public"."organizations" to "authenticated";

grant trigger on table "public"."organizations" to "authenticated";

grant truncate on table "public"."organizations" to "authenticated";

grant update on table "public"."organizations" to "authenticated";

grant delete on table "public"."organizations" to "service_role";

grant insert on table "public"."organizations" to "service_role";

grant references on table "public"."organizations" to "service_role";

grant select on table "public"."organizations" to "service_role";

grant trigger on table "public"."organizations" to "service_role";

grant truncate on table "public"."organizations" to "service_role";

grant update on table "public"."organizations" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";


  create policy "Tenant isolation: customers"
  on "public"."customers"
  as permissive
  for all
  to public
using ((tenant_id = ( SELECT profiles.organization_id
   FROM public.profiles
  WHERE (profiles.id = auth.uid()))));



  create policy "Org members can see each other"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((organization_id = ( SELECT profiles_1.organization_id
   FROM public.profiles profiles_1
  WHERE (profiles_1.id = auth.uid()))));



  create policy "Tenant isolation: orders"
  on "public"."service_orders"
  as permissive
  for all
  to public
using ((tenant_id = ( SELECT profiles.organization_id
   FROM public.profiles
  WHERE (profiles.id = auth.uid()))));



