import { test } from '@playwright/test';
import { loginAsEmployee } from './loginHelper';
import { createNewStarter } from './userHelper';

test('create new starter', async ({ page }) => {
  await loginAsEmployee(page);
  await createNewStarter(page);
});
