export const normalizeBDPhone = (raw: string) => {
  let v = raw.replace(/[^\d+]/g, '');
  if (v.includes('+')) v = '+' + v.replace(/\+/g, '');
  if (v.startsWith('01')) v = '+88' + v;     // 01... -> +8801...
  if (v.startsWith('880')) v = '+' + v;      // 880... -> +880...
  if (v.startsWith('+880')) v = v.slice(0, 14); // +8801 + 9 digits
  return v;
};