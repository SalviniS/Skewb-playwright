
import { expect, Page } from '@playwright/test';

export type NewStarterData = {
  firstName: string;
  lastName: string;
  gender: 'Female' | 'Male' | 'Other';
  dobYear: string;
  dobDay: string;
  dobMonthName: string;
  dobMonthNumber: string;
  startDateDay: string;
  startDateMonthName: string;
  startDateMonthNumber: string;
  startDateYear: string;
  personalEmail: string;
  personalPhone: string;
  workEmail: string;
  jobTitle: string;
  discipline: string;
  skill: string;
  teamLeader: string;
  lineManager: string;
  startDate: string;
  accountType: string;
  paidVia: string;
  payrollCompany: string;
  payPeriod: string;
  hasDrivingLicense: boolean;
};

const DEFAULT_NEW_STARTER: NewStarterData = {
  firstName: 'joshu',
  lastName: 'y',
  gender: 'Female',
  dobYear: '2008',
  dobDay: '16',
  dobMonthName: 'March',
  dobMonthNumber: '03',
  startDateDay: '01',
  startDateMonthName: 'March',
  startDateMonthNumber: '03',
  startDateYear: '2026',
  personalEmail: 'yy@gmail.com',
  personalPhone: '1234567890',
  workEmail: 'yy@gmail.com',
  jobTitle: 'Reinstatement Agent',
  discipline: 'Electric',
  skill: 'Skill',
  teamLeader: 'Brindha P',
  lineManager: 'Bavithra S',
  startDate: '2026-03-01',
  accountType: 'JN Civils Employee',
  paidVia: 'Hudson',
  payrollCompany: 'JN Civils',
  payPeriod: 'Monthly',
  hasDrivingLicense: true,
};

export async function createNewStarter(
  page: Page,
  data: Partial<NewStarterData> = {},
): Promise<void> {
  const d: NewStarterData = { ...DEFAULT_NEW_STARTER, ...data };

  await page.getByRole('link', { name: 'Users' }).click();
  await page.getByRole('link', { name: 'New Starters' }).click();

  await page.getByRole('textbox', { name: 'First Name' }).fill(d.firstName);
  await page.getByRole('textbox', { name: 'Last Name' }).fill(d.lastName);

  await page.getByRole('combobox', { name: 'Gender' }).click();
  await page.getByRole('option', { name: d.gender }).click();

  const dobInput = page.getByRole('textbox', { name: /date of birth|dob/i });
  if (await dobInput.count()) {
    await dobInput.first().fill(`${d.dobDay}/${d.dobMonthNumber}/${d.dobYear}`);
  } else {
    await page.getByRole('button', { name: /Choose date, selected date is|Choose date/i }).click();

    const yearSwitch = page.getByRole('button', { name: /switch.*year|calendar view is open/i });
    if (await yearSwitch.count()) {
      await yearSwitch.first().click();
    }

    const yearOption = page.getByRole('radio', { name: d.dobYear });
    if (await yearOption.count()) {
      await yearOption.first().click();
    }

    const monthButton = page.getByRole('button', { name: new RegExp(d.dobMonthName, 'i') });
    if (await monthButton.count()) {
      await monthButton.first().click();
    }

    await page.getByRole('gridcell', { name: d.dobDay, exact: true }).click();
  }

  await page.getByRole('textbox', { name: 'Personal Email' }).fill(d.personalEmail);
  await page.getByRole('textbox', { name: 'Personal Phone (Mobile)' }).fill(d.personalPhone);

  if (d.hasDrivingLicense) {
    await page.getByRole('radio', { name: 'Yes' }).check();
  } else {
    await page.getByRole('radio', { name: 'No' }).check();
  }

  await page.getByRole('textbox', { name: 'Work Email Address' }).fill(d.workEmail);
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('combobox', { name: 'Job Title' }).click();
  await page.getByRole('option', { name: d.jobTitle }).click();
  await page.getByRole('combobox', { name: 'Discipline' }).click();
  await page.getByRole('option', { name: d.discipline }).click();
  await page.getByRole('combobox', { name: 'Skills' }).click();
  await page.getByRole('option', { name: d.skill }).click();

  await page.getByRole('combobox', { name: 'Team Leader' }).click();
  await page.getByRole('combobox', { name: 'Team Leader' }).fill(d.teamLeader.slice(0, 3));
  await page.getByRole('option', { name: d.teamLeader }).click();

  await page.getByRole('combobox', { name: 'Line Manager' }).click();
  await page.getByRole('combobox', { name: 'Line Manager' }).fill(d.lineManager.slice(0, 4));
  await page.getByRole('option', { name: d.lineManager }).click();

  const startDateInput = page.getByRole('textbox', { name: /start date/i });
  if (await startDateInput.count()) {
    const startDateValue = `${d.startDateYear}-${d.startDateMonthNumber}-${d.startDateDay}`;
    const isDateInput = await startDateInput.first().evaluate((el) => (el as HTMLInputElement).type === 'date');
    if (isDateInput) {
      await startDateInput.first().fill(startDateValue);
    } else {
      await startDateInput.first().fill(`${d.startDateDay}/${d.startDateMonthNumber}/${d.startDateYear}`);
    }
  } else {
    const startDateButton = page.getByRole('button', { name: /start date|choose date/i });
    if (await startDateButton.count()) {
      await startDateButton.first().click();
      const yearSwitch = page.getByRole('button', { name: /switch.*year|calendar view is open/i });
      if (await yearSwitch.count()) {
        await yearSwitch.first().click();
      }
      const yearOption = page.getByRole('radio', { name: d.startDateYear });
      if (await yearOption.count()) {
        await yearOption.first().click();
      }
      const monthButton = page.getByRole('button', { name: new RegExp(d.startDateMonthName, 'i') });
      if (await monthButton.count()) {
        await monthButton.first().click();
      }
      await page.getByRole('gridcell', { name: d.startDateDay, exact: true }).click();
    }
  }

  const accountTypeCombo = page.getByRole('combobox', { name: 'Account Type' });
  await accountTypeCombo.click();
  await accountTypeCombo.fill(d.accountType);
  await accountTypeCombo.press('ArrowDown');
  await accountTypeCombo.press('Enter');
  await expect(accountTypeCombo).toHaveValue(d.accountType);
  const paidViaCombo = page.getByRole('combobox', { name: 'Paid via' });
  await paidViaCombo.scrollIntoViewIfNeeded();
  await paidViaCombo.click({ force: true });
  await paidViaCombo.fill(d.paidVia);
  await paidViaCombo.press('ArrowDown');
  await paidViaCombo.press('Enter');
  await expect(paidViaCombo).toHaveValue(d.paidVia);
  await page.getByRole('button', { name: 'Next' }).click();

  let payrollCombo = page.getByRole('combobox', { name: /payroll|company|employer/i });
  if (await payrollCombo.count()) {
    await payrollCombo.first().scrollIntoViewIfNeeded();
    await payrollCombo.first().click({ force: true });
    await payrollCombo.first().fill(d.payrollCompany);
    await payrollCombo.first().press('ArrowDown');
    await payrollCombo.first().press('Enter');
  } else {
    payrollCombo = page.getByRole('textbox', { name: /payroll|company|employer/i });
    if (await payrollCombo.count()) {
      await payrollCombo.first().scrollIntoViewIfNeeded();
      await payrollCombo.first().click({ force: true });
      await payrollCombo.first().fill(d.payrollCompany);
      await payrollCombo.first().press('ArrowDown');
      await payrollCombo.first().press('Enter');
    } else {
      await page.locator('.MuiInputBase-root').first().click();
      const payrollOption = page.getByRole('option', { name: d.payrollCompany });
      await payrollOption.waitFor({ state: 'visible' });
      await payrollOption.click({ force: true });
    }
  }
  const payPeriodCombo = page.getByRole('combobox', { name: 'Per' });
  await payPeriodCombo.scrollIntoViewIfNeeded();
  await payPeriodCombo.click({ force: true });
  await payPeriodCombo.fill(d.payPeriod);
  await payPeriodCombo.press('ArrowDown');
  await payPeriodCombo.press('Enter');
  await expect(payPeriodCombo).toHaveValue(d.payPeriod);
  await page.getByRole('button', { name: 'Next' }).click();
}
