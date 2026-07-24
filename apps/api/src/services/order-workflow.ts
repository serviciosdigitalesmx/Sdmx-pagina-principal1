export type CanonicalOrderPhase =
  | 'intake'
  | 'diagnosis'
  | 'quote'
  | 'authorization'
  | 'work'
  | 'ready'
  | 'delivered'
  | 'warranty'
  | 'cancelled'
  | 'closed';

export type WorkflowStatus = {
  status_key: string;
  sort_order: number;
  is_terminal: boolean;
  metadata?: unknown;
};

export type ResolvedWorkflowStatus = WorkflowStatus & {
  canonicalPhase: CanonicalOrderPhase;
  nextStatusKeys: string[];
};

const PHASE_TRANSITIONS: Record<CanonicalOrderPhase, ReadonlySet<CanonicalOrderPhase>> = {
  intake: new Set(['intake', 'diagnosis', 'quote', 'work', 'cancelled']),
  diagnosis: new Set(['diagnosis', 'quote', 'authorization', 'work', 'cancelled']),
  quote: new Set(['quote', 'authorization', 'work', 'cancelled']),
  authorization: new Set(['quote', 'authorization', 'work', 'cancelled']),
  work: new Set(['work', 'ready', 'cancelled']),
  ready: new Set(['work', 'ready', 'delivered', 'warranty', 'closed', 'cancelled']),
  delivered: new Set(['warranty', 'closed']),
  warranty: new Set(['diagnosis', 'work', 'ready', 'warranty', 'closed']),
  cancelled: new Set(['closed']),
  closed: new Set(),
};

const CANONICAL_PHASES = new Set<CanonicalOrderPhase>(Object.keys(PHASE_TRANSITIONS) as CanonicalOrderPhase[]);

function readMetadata(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function inferCanonicalOrderPhase(statusKey: string, metadata?: unknown): CanonicalOrderPhase {
  const configured = readMetadata(metadata).canonical_phase;
  if (typeof configured === 'string' && CANONICAL_PHASES.has(configured as CanonicalOrderPhase)) {
    return configured as CanonicalOrderPhase;
  }

  const key = statusKey.toLowerCase();
  if (/cancel|rechazad/.test(key)) return 'cancelled';
  if (/cerrad|closed|archivad/.test(key)) return 'closed';
  if (/garant|warranty|reabiert/.test(key)) return 'warranty';
  if (/entreg|delivered/.test(key)) return 'delivered';
  if (/listo|ready|quality|realizado|completad|terminad/.test(key)) return 'ready';
  if (/repar|trabajo|work|servicio_programado|en_servicio|refaccion/.test(key)) return 'work';
  if (/autoriz|aprob/.test(key)) return 'authorization';
  if (/cotiz|quote|presup|esperando_autorizacion/.test(key)) return 'quote';
  if (/diagn|revision|revisión|evaluac/.test(key)) return 'diagnosis';
  return 'intake';
}

export function resolveOrderWorkflow(statuses: WorkflowStatus[]): ResolvedWorkflowStatus[] {
  const ordered = [...statuses].sort((left, right) => left.sort_order - right.sort_order || left.status_key.localeCompare(right.status_key));
  const keys = new Set(ordered.map((status) => status.status_key));

  return ordered.map((status, index) => {
    const metadata = readMetadata(status.metadata);
    const configuredNext = Array.isArray(metadata.next_status_keys)
      ? metadata.next_status_keys.filter((key): key is string => typeof key === 'string' && keys.has(key))
      : null;
    const cancellationKeys = ordered
      .filter((candidate) => inferCanonicalOrderPhase(candidate.status_key, candidate.metadata) === 'cancelled')
      .map((candidate) => candidate.status_key);
    const currentPhase = inferCanonicalOrderPhase(status.status_key, status.metadata);
    const defaultNext = status.is_terminal
      ? []
      : [
          ...ordered.slice(index + 1)
            .filter((candidate) => PHASE_TRANSITIONS[currentPhase].has(inferCanonicalOrderPhase(candidate.status_key, candidate.metadata)))
            .map((candidate) => candidate.status_key),
          ...cancellationKeys,
        ].filter((key) => key !== status.status_key);

    return {
      ...status,
      canonicalPhase: inferCanonicalOrderPhase(status.status_key, status.metadata),
      nextStatusKeys: [...new Set(configuredNext ?? defaultNext)],
    };
  });
}

export function validateOrderTransition(
  statuses: WorkflowStatus[],
  previousStatusKey: string,
  nextStatusKey: string,
): { previous: ResolvedWorkflowStatus; next: ResolvedWorkflowStatus } {
  const workflow = resolveOrderWorkflow(statuses);
  const previous = workflow.find((status) => status.status_key === previousStatusKey);
  const next = workflow.find((status) => status.status_key === nextStatusKey);

  if (!previous || !next) {
    throw new Error('WORKFLOW_STATUS_NOT_CONFIGURED');
  }
  if (previous.status_key === next.status_key) {
    throw new Error('WORKFLOW_STATUS_UNCHANGED');
  }
  if (previous.is_terminal || previous.canonicalPhase === 'closed') {
    throw new Error('WORKFLOW_TERMINAL_STATUS');
  }
  if (!previous.nextStatusKeys.includes(next.status_key)) {
    throw new Error('WORKFLOW_TRANSITION_NOT_CONFIGURED');
  }
  if (!PHASE_TRANSITIONS[previous.canonicalPhase].has(next.canonicalPhase)) {
    throw new Error('WORKFLOW_CANONICAL_RULE_VIOLATION');
  }

  return { previous, next };
}

export function validateWorkflowConfiguration(statuses: WorkflowStatus[]): void {
  const workflow = resolveOrderWorkflow(statuses);
  const keys = new Set(workflow.map((status) => status.status_key));
  if (keys.size !== workflow.length) throw new Error('WORKFLOW_DUPLICATE_STATUS');
  if (!workflow.some((status) => status.canonicalPhase === 'intake')) throw new Error('WORKFLOW_INTAKE_REQUIRED');
  if (!workflow.some((status) => ['delivered', 'closed'].includes(status.canonicalPhase))) throw new Error('WORKFLOW_COMPLETION_REQUIRED');

  for (const status of workflow) {
    const configuredNext = readMetadata(status.metadata).next_status_keys;
    if (Array.isArray(configuredNext) && configuredNext.some((key) => typeof key !== 'string' || !keys.has(key))) {
      throw new Error('WORKFLOW_UNKNOWN_NEXT_STATUS');
    }
    if (status.is_terminal && status.nextStatusKeys.length > 0) throw new Error('WORKFLOW_TERMINAL_HAS_TRANSITIONS');
    for (const nextKey of status.nextStatusKeys) {
      const next = workflow.find((candidate) => candidate.status_key === nextKey);
      if (!next || !PHASE_TRANSITIONS[status.canonicalPhase].has(next.canonicalPhase)) {
        throw new Error('WORKFLOW_CANONICAL_RULE_VIOLATION');
      }
    }
  }
}
