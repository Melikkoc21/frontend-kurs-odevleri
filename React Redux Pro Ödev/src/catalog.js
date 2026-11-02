export const categories = ['Tümü', 'Ev', 'Aksesuar', 'Aydınlatma', 'Mobilya'];

export const products = [
  { id: 'ceramic-set', name: 'Kıyı Seramik Seti', category: 'Ev', price: 890, oldPrice: 1120, color: 'stone', image: 'photo-1490312278390-ab64016e0aa9', tag: 'Çok satan' },
  { id: 'arc-lamp', name: 'Arc Masa Lambası', category: 'Aydınlatma', price: 2450, color: 'amber', image: 'photo-1507473885765-e6ed057f782c', tag: 'Yeni' },
  { id: 'linen-tote', name: 'Günlük Keten Çanta', category: 'Aksesuar', price: 640, color: 'blue', image: 'photo-1544816155-12df9643f363', tag: '' },
  { id: 'oak-stool', name: 'Oak Yan Sehpa', category: 'Mobilya', price: 3780, oldPrice: 4250, color: 'wood', image: 'photo-1499933374294-4584851497cc', tag: '−11%' },
  { id: 'soft-throw', name: 'Soft Dokuma Örtü', category: 'Ev', price: 1280, color: 'linen', image: 'photo-1600369671236-e74521d4b6ad', tag: '' },
  { id: 'glass-vase', name: 'Forma Cam Vazo', category: 'Ev', price: 970, color: 'green', image: 'photo-1578500494198-246f612d3b3d', tag: 'El yapımı' },
  { id: 'desk-tray', name: 'Düzenleyici Tepsi', category: 'Aksesuar', price: 520, color: 'peach', image: 'photo-1494438639946-1ebd1d20bf85', tag: '' },
  { id: 'pendant-light', name: 'Mori Sarkıt Aydınlatma', category: 'Aydınlatma', price: 3120, color: 'cream', image: 'photo-1507473885765-e6ed057f782c', tag: 'Sınırlı seri' },
];

export const imageUrl = (photo, width = 800) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=85`;
