'use strict';

const checkoutDemoPhone = '00000001';
const checkoutDefaultAreaCode = '+853';
const checkoutPhoneRegions = {
  '+853': { label: '澳门', length: 8 },
  '+852': { label: '香港', length: 8 },
  '+86': { label: '中国内地', length: 11 },
};

function splitCheckoutPhone(value) {
  const compact = value.trim().replace(/[\s()-]/g, '').replace(/^00(?=\d{9,}$)/, '+');
  const areaCode = Object.keys(checkoutPhoneRegions).find((code) => compact.startsWith(code));
  return { areaCode, number: areaCode ? compact.slice(areaCode.length) : compact };
}

function normalizeCheckoutPhone(value, selectedAreaCode) {
  const { areaCode = selectedAreaCode, number } = splitCheckoutPhone(value);
  const region = checkoutPhoneRegions[areaCode];
  if (!/^\d+$/.test(number) || number.length !== region?.length || (areaCode === '+86' && !number.startsWith('1'))) return '';
  return areaCode + number;
}

function createCheckoutMemberDirectory() {
  const knownInTab = new Map();
  const storagePrefix = 'mc-mall.android-kiosk.member.v1.';

  async function match(phone) {
    const demo = phone === checkoutDefaultAreaCode + checkoutDemoPhone;
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

  function memberId(key, persistent) {
    return persistent ? key : `local-${crypto.getRandomValues(new Uint32Array(2)).join('-')}`;
  }

  function isRegistered(key) {
    try {
      return localStorage.getItem(storagePrefix + key) === '1';
    } catch {
      return false;
    }
  }

  function find({ key, demo, persistent, profile }) {
    let id = knownInTab.get(key);
    if (!id && (demo || (persistent && isRegistered(key)))) {
      id = memberId(key, persistent);
      knownInTab.set(key, id);
    }
    return id ? { ...profile, id, newMember: false } : null;
  }

  function register(match) {
    const existing = find(match);
    if (existing) return existing;

    const { key, persistent, profile } = match;
    if (persistent) {
      try {
        localStorage.setItem(storagePrefix + key, '1');
      } catch {
        // Membership is still available in the current tab if storage is disabled.
      }
    }
    const id = memberId(key, persistent);
    knownInTab.set(key, id);
    return { ...profile, id, newMember: true };
  }

  return { match, find, register };
}
