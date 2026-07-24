import assert from 'node:assert/strict';
import test from 'node:test';
import {
  inferCanonicalOrderPhase,
  resolveOrderWorkflow,
  validateOrderTransition,
  validateWorkflowConfiguration,
} from '../dist/services/order-workflow.js';

const status = (status_key, sort_order, canonical_phase, next_status_keys, is_terminal = false) => ({
  status_key,
  sort_order,
  is_terminal,
  metadata: {
    canonical_phase,
    ...(next_status_keys ? { next_status_keys } : {}),
  },
});

test('allows tenant branches that preserve canonical rules', () => {
  const workflow = [
    status('recibida', 1, 'intake', ['revision', 'express']),
    status('revision', 2, 'diagnosis', ['trabajo']),
    status('express', 3, 'work', ['lista']),
    status('trabajo', 4, 'work', ['lista']),
    status('lista', 5, 'ready', ['entregada']),
    status('entregada', 6, 'delivered', [], true),
  ];

  assert.doesNotThrow(() => validateWorkflowConfiguration(workflow));
  assert.equal(validateOrderTransition(workflow, 'recibida', 'express').next.canonicalPhase, 'work');
});

test('rejects a configured transition that violates canonical phases', () => {
  const workflow = [
    status('recibida', 1, 'intake', ['entregada']),
    status('entregada', 2, 'delivered', [], true),
  ];

  assert.throws(() => validateWorkflowConfiguration(workflow), /WORKFLOW_CANONICAL_RULE_VIOLATION/);
});

test('never allows transitions out of a terminal status', () => {
  const workflow = [
    status('recibida', 1, 'intake', ['cerrada']),
    status('cerrada', 2, 'closed', [], true),
  ];

  assert.throws(() => validateOrderTransition(workflow, 'cerrada', 'recibida'), /WORKFLOW_TERMINAL_STATUS/);
});

test('derives compatible forward transitions for existing tenant workflows', () => {
  const workflow = resolveOrderWorkflow([
    { status_key: 'recibido', sort_order: 1, is_terminal: false },
    { status_key: 'diagnostico', sort_order: 2, is_terminal: false },
    { status_key: 'reparacion', sort_order: 3, is_terminal: false },
    { status_key: 'listo', sort_order: 4, is_terminal: false },
    { status_key: 'entregado', sort_order: 5, is_terminal: true },
  ]);

  assert.deepEqual(workflow.find((item) => item.status_key === 'reparacion')?.nextStatusKeys, ['listo']);
  assert.equal(inferCanonicalOrderPhase('servicio_realizado'), 'ready');
});

test('requires an intake and a completion phase', () => {
  assert.throws(
    () => validateWorkflowConfiguration([status('trabajo', 1, 'work', [], true)]),
    /WORKFLOW_INTAKE_REQUIRED/,
  );
});
