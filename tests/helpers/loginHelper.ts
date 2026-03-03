import { expect, Page } from '@playwright/test';

type LoginOptions = {
  baseURL?: string;
  username?: string;
  password?: string;
  waitForNavigation?: boolean;
};

const DEFAULT_BASE_URL = process.env.BASE_URL || 'https://works-jnc.dev.skewbdigital.co.uk';
const DEFAULT_USERNAME = process.env.TEST_USERNAME || process.env.LOGIN_USERNAME || 'james.tyreman@skewb.uk';
const DEFAULT_PASSWORD = process.env.TEST_PASSWORD || process.env.LOGIN_PASSWORD || 'Password!444';

async function login(page: Page, options: LoginOptions = {}): Promise<void> {
  const baseURL = options.baseURL || DEFAULT_BASE_URL;
  const username = options.username || DEFAULT_USERNAME;
  const password = options.password || DEFAULT_PASSWORD;
  const waitForNavigation = options.waitForNavigation !== false;

  await page.goto(baseURL);

  const usernameInput = page.getByRole('textbox', { name: 'Username / Email' });
  const passwordInput = page.getByRole('textbox', { name: 'Password' });
  const signInButton = page.getByRole('button', { name: 'sign in' });

  await usernameInput.fill(username);
  await passwordInput.fill(password);

  if (waitForNavigation) {
    await Promise.all([page.waitForLoadState('networkidle'), signInButton.click()]);
  } else {
    await signInButton.click();
  }
}

export async function loginAsEmployee(page: Page, options: LoginOptions = {}): Promise<void> {
  await login(page, options);
}

export async function loginAsEmployeeAndOpenNewStarter(page: Page, options: LoginOptions = {}): Promise<void> {
  await loginAsEmployee(page, options);

  await page.getByRole('link', { name: 'Users', exact: true }).click();
  await page.getByRole('link', { name: 'New Starters' }).click();
  await expect(page).toHaveURL(/users\/add|new-starter/i, { timeout: 15000 });
}
