import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isoOf, dayIndex, isoFromDayIndex } from '../js/core/store.js';

const DAY = 86400000;

test('dayIndex avanza exactamente 1 por cada día natural', () => {
  const base = dayIndex('2026-09-06');
  assert.equal(dayIndex('2026-09-07') - base, 1);
  assert.equal(dayIndex('2026-09-16') - base, 10);
  assert.equal(dayIndex('2026-10-06') - base, 30);
});

test('isoFromDayIndex es el inverso de dayIndex', () => {
  for (const iso of ['2026-01-01', '2026-02-28', '2026-03-29', '2026-09-06', '2026-12-31']) {
    assert.equal(isoFromDayIndex(dayIndex(iso)), iso);
  }
});

test('el conteo es estable al cruzar un cambio de hora (DST)', () => {
  // Último domingo de marzo de 2026 en Europa: 29-mar (cambio de hora).
  assert.equal(dayIndex('2026-03-30') - dayIndex('2026-03-28'), 2);
  assert.equal(dayIndex('2026-10-26') - dayIndex('2026-10-24'), 2);
});

test('isoOf usa la fecha local del instante dado', () => {
  // Mediodía local: la fecha local coincide con el día natural, sin ambigüedad.
  const noon = new Date(2026, 8, 6, 12, 0, 0); // 6 sep 2026, 12:00 local
  assert.equal(isoOf(noon.getTime()), '2026-09-06');
});

test('los días transcurridos crecen 1 por cada día que pasa', () => {
  const start = '2026-09-06';
  const startIdx = dayIndex(start);
  const daysAt = (iso) => Math.max(0, dayIndex(iso) - startIdx);
  assert.equal(daysAt('2026-09-06'), 0);
  assert.equal(daysAt('2026-09-07'), 1);
  assert.equal(daysAt('2026-09-13'), 7);
});
