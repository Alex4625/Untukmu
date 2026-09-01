import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Plan } from '../lib/types';
import Plans, { filterActivePlans, groupPlansIntoScenes } from '../components/Plans';

const dummyPlan = (
  id: string,
  title: string,
  planStatus: Plan['plan_status'] = 'ingin_dilakukan',
  status: Plan['status'] = 'active',
  sortOrder = 0
): Plan => ({
  id,
  title,
  note: `Catatan masa depan untuk rencana ${title}`,
  plan_status: planStatus,
  status,
  sort_order: sortOrder,
  created_at: new Date().toISOString()
});

describe('Plans Chapter Future Journal Architecture (TASK-019, DESIGN.md section 13)', () => {
  it('should export Plans as a functional component', () => {
    assert.strictEqual(typeof Plans, 'function');
  });

  it('should filter active plans and ignore draft/hidden plans', () => {
    const raw: Plan[] = [
      dummyPlan('1', 'Rencana Aktif', 'ingin_dilakukan', 'active', 2),
      dummyPlan('2', 'Rencana Draf', 'ingin_dilakukan', 'draft', 1),
      dummyPlan('3', 'Rencana Hidden', 'ingin_dilakukan', 'hidden', 3),
      dummyPlan('4', 'Rencana Aktif 2', 'direncanakan', 'active', 0)
    ];

    const active = filterActivePlans(raw);
    assert.strictEqual(active.length, 2);
    assert.strictEqual(active[0].id, '4', 'Must sort by sort_order ascending');
    assert.strictEqual(active[1].id, '1');
  });

  it('should return empty group when plans array is empty', () => {
    assert.deepStrictEqual(groupPlansIntoScenes([]), []);
  });

  it('should produce strictly 1 scene when all plans are in 1 status', () => {
    const wishlistPlans = [
      dummyPlan('1', 'Piknik Bersama', 'ingin_dilakukan'),
      dummyPlan('2', 'Lihat Bintang', 'ingin_dilakukan'),
      dummyPlan('3', 'Masak Kue Bersama', 'ingin_dilakukan')
    ];

    const groups = groupPlansIntoScenes(wishlistPlans);
    assert.strictEqual(groups.length, 1, 'Must strictly be 1 scene');
    assert.strictEqual(groups[0].plans.length, 3);
  });

  it('should produce strictly 1 scene when all plans are in tercapai status', () => {
    const achievedPlans = [
      dummyPlan('1', 'Jalan ke Pantai', 'tercapai'),
      dummyPlan('2', 'Makan Es Krim Bersama', 'tercapai')
    ];

    const groups = groupPlansIntoScenes(achievedPlans);
    assert.strictEqual(groups.length, 1);
    assert.strictEqual(groups[0].id, 'plans-achieved');
  });

  it('should produce strictly 2 scenes when plans are spread across all 3 statuses', () => {
    const mixedPlans = [
      dummyPlan('1', 'Ke Danau Bersama', 'ingin_dilakukan'),
      dummyPlan('2', 'Beli Kado Wisuda', 'direncanakan'),
      dummyPlan('3', 'Liburan Akhir Tahun', 'direncanakan'),
      dummyPlan('4', 'Bunga Pertama', 'tercapai'),
      dummyPlan('5', 'Foto Studio Bersama', 'tercapai')
    ];

    const groups = groupPlansIntoScenes(mixedPlans);
    assert.strictEqual(groups.length, 2, 'Must strictly cap at 2 scenes');
    assert.strictEqual(groups[0].id, 'plans-future');
    assert.strictEqual(groups[0].plans.length, 3, 'Future scene has wishlist and planned');
    assert.strictEqual(groups[1].id, 'plans-achieved');
    assert.strictEqual(groups[1].plans.length, 2, 'Achieved scene has fulfilled milestones');
  });
});
