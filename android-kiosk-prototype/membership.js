'use strict';

const checkoutDemoPhone = '00000001';

function normalizeCheckoutPhone(value) {
  const number = value.trim().replace(/[\s()-]/g, '').replace(/^00(?=\d{9,}$)/, '+');
  if (/^\d{8}$/.test(number)) return '+853' + number;
  if (/^1\d{10}$/.test(number)) return '+86' + number;
  if (/^\+(?:85[23]\d{8}|861\d{10})$/.test(number)) return number;
  return '';
}

function createCheckoutMemberDirectory() {
  const knownInTab = new Map();
  const storagePrefix = 'mc-mall.android-kiosk.member.v1.';

  async function match(phone) {
    const demo = phone === '+853' + checkoutDemoPhone;
    const digest = window.crypto.subtle
      ? await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(phone)).catch(() => null)
      : null;
    const key = digest ? Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('') : phone;
    return {
      key, demo, persistent: Boolean(digest),
      profile: {
        name: demo ? '陈女士' : '会员',
        tier: '普通会员',
        maskedPhone: phone.replace(/^(\+85[23]|\+86)\d+(\d{4})$/, '$1 •••• $2'),
      },
    };
  }

  function findOrRegister({ key, demo, persistent, profile }) {
    let existing = demo || knownInTab.has(key);
    if (!existing && persistent) {
      try {
        existing = localStorage.getItem(storagePrefix + key) === '1';
        if (!existing) localStorage.setItem(storagePrefix + key, '1');
      } catch {
        // Membership is still available in the current tab if storage is disabled.
      }
    }
    const id = persistent ? key : knownInTab.get(key) ?? `local-${crypto.getRandomValues(new Uint32Array(2)).join('-')}`;
    knownInTab.set(key, id);
    return { ...profile, id, newMember: !existing };
  }

  return { match, findOrRegister };
}
