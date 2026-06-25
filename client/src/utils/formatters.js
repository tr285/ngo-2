export const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);

export const toInputDate = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().split('T')[0];
};

export const toInputDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

export const getNestedValue = (obj, path) =>
  path.split('.').reduce((acc, key) => acc?.[key], obj);

export const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;

  keys.slice(0, -1).forEach((key) => {
    current[key] = { ...(current[key] || {}) };
    current = current[key];
  });

  current[keys[keys.length - 1]] = value;
  return result;
};

export const arrayToCsv = (value) =>
  Array.isArray(value) ? value.join(', ') : value || '';

export const csvToArray = (value) =>
  value ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];
