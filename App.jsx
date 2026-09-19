import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route as BaseRoute,
  useParams,
  useNavigate,
  Link,
} from 'react-router-dom';

// --- VARSAYILAN RESTORAN MENÜ VERİSİ ---
const DEFAULT_MENU = [
  {
    id: 'c1',
    category: '☕ Sıcak İçecekler',
    items: [
      {
        id: '1',
        name: 'Türk Kahvesi',
        price: 60,
        desc: 'Geleneksel köpüklü Türk kahvesi',
      },
      {
        id: '2',
        name: 'Çay (Bardak)',
        price: 25,
        desc: 'Taze demlenmiş Rize çayı',
      },
      {
        id: '3',
        name: 'Filtre Kahve',
        price: 80,
        desc: '%100 Arabica çekirdeklerinden',
      },
      {
        id: '4',
        name: 'Latte',
        price: 90,
        desc: 'Espresso ve taze süt köpüğü',
      },
      {
        id: '5',
        name: 'Salep',
        price: 85,
        desc: 'Tarçın ikramı ile lezzetli sıcak salep',
      },
    ],
  },
  {
    id: 'c2',
    category: '🥤 Soğuk İçecekler',
    items: [
      {
        id: '6',
        name: 'Iced Latte',
        price: 95,
        desc: 'Soğuk süt, espresso ve buz',
      },
      {
        id: '7',
        name: 'Ev Yapımı Limonata',
        price: 70,
        desc: 'Taze nane ve limon dilimleri ile',
      },
      {
        id: '8',
        name: 'Milkshake',
        price: 110,
        desc: 'Çikolatalı, Çilekli veya Vanilyalı',
      },
      {
        id: '9',
        name: 'Ice Americano',
        price: 85,
        desc: 'Buzlu sert ve ferahlatıcı espresso',
      },
      { id: '10', name: 'Maden Suyu', price: 30, desc: 'Doğal mineralli soda' },
    ],
  },
  {
    id: 'c3',
    category: '🍰 Tatlılar & Pastalar',
    items: [
      {
        id: '11',
        name: 'San Sebastian Cheesecake',
        price: 150,
        desc: 'Eritilmiş Belçika çikolatası eşliğinde',
      },
      {
        id: '12',
        name: 'Tiramisu',
        price: 130,
        desc: 'Nefis kahve aromalı İtalyan tatlısı',
      },
      {
        id: '13',
        name: 'Çikolatalı Waffle',
        price: 180,
        desc: 'Taze meyveler ve bol çikolata soslu',
      },
      {
        id: '14',
        name: 'Fıstıklı Baklava (2 Dilim)',
        price: 140,
        desc: 'Çıtır yufka ve taze Antep fıstığı',
      },
    ],
  },
  {
    id: 'c4',
    category: '🍕 Yiyecekler & Atıştırmalıklar',
    items: [
      {
        id: '15',
        name: 'Kaşarlı Tost',
        price: 90,
        desc: 'Patates kızartması ve domates dilimleriyle',
      },
      {
        id: '16',
        name: 'Karışık Tost',
        price: 110,
        desc: 'Bol sucuk, kaşar peyniri ve salça',
      },
      {
        id: '17',
        name: 'Çınarlı Burger Menü',
        price: 220,
        desc: '150g dana hamburger, patates kızartması',
      },
      {
        id: '18',
        name: 'Patates Kızartması Tabak',
        price: 80,
        desc: 'Özel baharat harmanlı çıtır patatesler',
      },
    ],
  },
];

// --- CANLI VERİ DEPOLAMA (LOCALSTORAGE) ---
const getStoredMenu = () => {
  try {
    const raw = localStorage.getItem('cinarli_menu_data');
    return raw ? JSON.parse(raw) : DEFAULT_MENU;
  } catch (e) {
    return DEFAULT_MENU;
  }
};

const saveStoredMenu = menu => {
  localStorage.setItem('cinarli_menu_data', JSON.stringify(menu));
  window.dispatchEvent(new Event('menu_changed'));
};

const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem('cinarli_orders');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveStoredOrders = orders => {
  localStorage.setItem('cinarli_orders', JSON.stringify(orders));
  window.dispatchEvent(new Event('orders_changed'));
};

// --- ANA UYGULAMA ---
export default function App() {
  return (
    <Router>
      <div
        style={{
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
          color: '#0f172a',
        }}
      >
        <Switch>
          <BaseRoute path='/' element={<HomeView />} />
          <BaseRoute path='/masa/:masaId' element={<MasaMusteriView />} />
          <BaseRoute path='/kasa' element={<KasaPaneli />} />
          <BaseRoute path='/qr-yazdir' element={<QRGeneratorView />} />
          <BaseRoute path='/menu-duzenle' element={<MenuEditorView />} />
        </Switch>
      </div>
    </Router>
  );
}

// 1. ANA YÖNETİM PANELİ GİRİŞ EKRANI
function HomeView() {
  const [testMasaNo, setTestMasaNo] = useState('1');
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 16px' }}>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '32px 24px',
          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '52px', marginBottom: '8px' }}>🌲</div>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1e293b',
            margin: '0 0 6px 0',
          }}
        >
          Çınarlı Cafe & Restorant
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 28px 0' }}>
          QR Kodlu Dijital Menü & Otomasyon Sistemi
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Kasa Paneli */}
          <Link
            to='/kasa'
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '16px',
              borderRadius: '16px',
              fontWeight: 'bold',
              fontSize: '15px',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '8px',
            }}
          >
            🖥️ Kasa & Mutfak Canlı Sipariş Paneli
          </Link>

          {/* Fiyat & Menü Düzenleme */}
          <Link
            to='/menu-duzenle'
            style={{
              backgroundColor: '#16a34a',
              color: '#ffffff',
              padding: '16px',
              borderRadius: '16px',
              fontWeight: 'bold',
              fontSize: '15px',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '8px',
            }}
          >
            ✏️ Fiyat & Menü Güncelleme Paneli
          </Link>

          {/* QR Kod Basma */}
          <Link
            to='/qr-yazdir'
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '16px',
              borderRadius: '16px',
              fontWeight: 'bold',
              fontSize: '15px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '8px',
            }}
          >
            🖨️ Masa QR Kodlarını Yazdır
          </Link>
        </div>

        {/* Manuel Masa Testi */}
        <div
          style={{
            marginTop: '28px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '20px',
            textAlign: 'left',
          }}
        >
          <label
            style={{
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              color: '#94a3b8',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            🔍 Menüyü Müşteri Gözüyle Test Et
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type='number'
              value={testMasaNo}
              onChange={e => setTestMasaNo(e.target.value)}
              placeholder='Masa No'
              style={{
                width: '90px',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
              }}
            />
            <button
              onClick={() => navigate(`/masa/${testMasaNo || 1}`)}
              style={{
                flex: 1,
                backgroundColor: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Masa {testMasaNo || 1} Menüsünü Aç ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. FİYAT VE MENÜ DÜZENLEME PANELİ
function MenuEditorView() {
  const [menu, setMenu] = useState(getStoredMenu());
  const [savedMessage, setSavedMessage] = useState(false);

  const handlePriceChange = (catId, itemId, newPrice) => {
    const updated = menu.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item =>
          item.id === itemId
            ? { ...item, price: parseFloat(newPrice) || 0 }
            : item
        ),
      };
    });
    setMenu(updated);
  };

  const handleNameChange = (catId, itemId, newName) => {
    const updated = menu.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item =>
          item.id === itemId ? { ...item, name: newName } : item
        ),
      };
    });
    setMenu(updated);
  };

  const handleAddItem = catId => {
    const updated = menu.map(cat => {
      if (cat.id !== catId) return cat;
      const newItem = {
        id: Date.now().toString(),
        name: 'Yeni Ürün',
        price: 50,
        desc: 'Ürün açıklaması',
      };
      return { ...cat, items: [...cat.items, newItem] };
    });
    setMenu(updated);
  };

  const handleDeleteItem = (catId, itemId) => {
    const updated = menu.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.filter(i => i.id !== itemId) };
    });
    setMenu(updated);
  };

  const handleSave = () => {
    saveStoredMenu(menu);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Tüm menüyü varsayılan fiyatlara sıfırlamak istediğinize emin misiniz?'
      )
    ) {
      setMenu(DEFAULT_MENU);
      saveStoredMenu(DEFAULT_MENU);
    }
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', padding: '24px 16px' }}>
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>
            ✏️ Fiyat & Menü Düzenleme Paneli
          </h2>
          <p
            style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}
          >
            Değişiklik yaptıktan sonra "Fiyatları Kaydet" butonuna basmayı
            unutmayın.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: '#16a34a',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            💾 Fiyatları Kaydet
          </button>
          <Link
            to='/'
            style={{
              color: '#2563eb',
              textDecoration: 'none',
              fontWeight: '600',
              padding: '10px',
              fontSize: '14px',
            }}
          >
            Geri Dön
          </Link>
        </div>
      </div>

      {savedMessage && (
        <div
          style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            color: '#166534',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          ✅ Fiyatlar başarıyla güncellendi! Müşteri ekranında anında geçerli
          oldu.
        </div>
      )}

      {menu.map(cat => (
        <div
          key={cat.id}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              borderBottom: '2px solid #f1f5f9',
              paddingBottom: '10px',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '17px', color: '#1e293b' }}>
              {cat.category}
            </h3>
            <button
              onClick={() => handleAddItem(cat.id)}
              style={{
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              + Yeni Ürün Ekle
            </button>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {cat.items.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <input
                  type='text'
                  value={item.name}
                  onChange={e =>
                    handleNameChange(cat.id, item.id, e.target.value)
                  }
                  style={{
                    flex: 2,
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                  }}
                />
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <input
                    type='number'
                    value={item.price}
                    onChange={e =>
                      handlePriceChange(cat.id, item.id, e.target.value)
                    }
                    style={{
                      width: '80px',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      textAlign: 'right',
                    }}
                  />
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      color: '#475569',
                    }}
                  >
                    ₺
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteItem(cat.id, item.id)}
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={handleReset}
          style={{
            backgroundColor: 'transparent',
            color: '#94a3b8',
            border: 'none',
            textDecoration: 'underline',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Varsayılan Menüye ve Fiyatlara Sıfırla
        </button>
      </div>
    </div>
  );
}

// 3. MÜŞTERİ MENÜSÜ & MASA SİPARİŞ EKRANI
function MasaMusteriView() {
  const { masaId } = useParams();
  const [menuData, setMenuData] = useState(getStoredMenu());
  const [activeCategory, setActiveCategory] = useState(menuData[0]?.id || 'c1');
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [note, setNote] = useState('');
  const [orderSent, setOrderSent] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);

  useEffect(() => {
    const handleMenuChange = () => setMenuData(getStoredMenu());
    window.addEventListener('menu_changed', handleMenuChange);
    return () => window.removeEventListener('menu_changed', handleMenuChange);
  }, []);

  const addToCart = item => {
    setCart(prev => {
      const existing = prev[item.id];
      if (existing) {
        return {
          ...prev,
          [item.id]: { ...existing, count: existing.count + 1 },
        };
      }
      return { ...prev, [item.id]: { ...item, count: 1 } };
    });
  };

  const removeFromCart = itemId => {
    setCart(prev => {
      const existing = prev[itemId];
      if (!existing) return prev;
      if (existing.count === 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: { ...existing, count: existing.count - 1 } };
    });
  };

  const cartList = Object.values(cart);
  const totalCount = cartList.reduce((sum, item) => sum + item.count, 0);
  const totalPrice = cartList.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  const handleSendOrder = () => {
    if (cartList.length === 0) return;
    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      masaId: masaId || '1',
      items: cartList,
      total: totalPrice,
      note: note.trim(),
      status: 'Yeni',
      createdAt: new Date().toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
    };

    const currentOrders = getStoredOrders();
    saveStoredOrders([newOrder, ...currentOrders]);

    setCart({});
    setIsCartOpen(false);
    setNote('');
    setOrderSent(true);
    setLastOrderId(newOrder.id);
  };

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '0 auto',
        paddingBottom: '100px',
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Üst Bilgi Barı */}
      <div
        style={{
          backgroundColor: '#1e293b',
          color: '#ffffff',
          padding: '16px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
              Çınarlı Cafe
            </h2>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Masaya Sipariş Ver
            </span>
          </div>
          <div
            style={{
              backgroundColor: '#2563eb',
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Masa {masaId}
          </div>
        </div>
      </div>

      {orderSent && (
        <div
          style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            padding: '14px 16px',
            margin: '16px',
            borderRadius: '12px',
            color: '#166534',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <strong>✅ Siparişiniz Mutfağa İletildi!</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
              Sipariş Kodu: #{lastOrderId}
            </p>
          </div>
          <button
            onClick={() => setOrderSent(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#166534',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Kategori Butonları */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '12px 16px',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        {menuData.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              whiteSpace: 'nowrap',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              backgroundColor:
                activeCategory === cat.id ? '#2563eb' : '#f1f5f9',
              color: activeCategory === cat.id ? '#ffffff' : '#475569',
            }}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {/* Ürün Listesi */}
      <div style={{ padding: '16px' }}>
        {menuData
          .find(c => c.id === activeCategory)
          ?.items.map(item => {
            const itemCount = cart[item.id]?.count || 0;
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div style={{ flex: 1, paddingRight: '12px' }}>
                  <h4
                    style={{
                      margin: '0 0 4px 0',
                      fontSize: '15px',
                      color: '#1e293b',
                    }}
                  >
                    {item.name}
                  </h4>
                  <p
                    style={{
                      margin: '0 0 6px 0',
                      fontSize: '12px',
                      color: '#64748b',
                    }}
                  >
                    {item.desc}
                  </p>
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: '#2563eb',
                      fontSize: '15px',
                    }}
                  >
                    {item.price} ₺
                  </span>
                </div>
                <div>
                  {itemCount > 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '8px',
                        padding: '4px 8px',
                      }}
                    >
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: 'none',
                          backgroundColor: '#e2e8f0',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        -
                      </button>
                      <span
                        style={{
                          fontWeight: 'bold',
                          fontSize: '14px',
                          minWidth: '16px',
                          textAlign: 'center',
                        }}
                      >
                        {itemCount}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: 'none',
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      style={{
                        padding: '8px 16px',
                        border: 'none',
                        backgroundColor: '#f1f5f9',
                        color: '#2563eb',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      + Ekle
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Alt Sepet Butonu */}
      {totalCount > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '448px',
            zIndex: 100,
          }}
        >
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              width: '100%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '14px 20px',
              borderRadius: '16px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                backgroundColor: '#ffffff',
                color: '#2563eb',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '13px',
              }}
            >
              {totalCount} Ürün
            </span>
            <span>Sepeti Onayla</span>
            <span>{totalPrice} ₺</span>
          </button>
        </div>
      )}

      {/* Sepet Penceresi */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              width: '100%',
              maxWidth: '480px',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '20px',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '18px' }}>
                Sipariş Özetiniz (Masa {masaId})
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              {cartList.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: '600' }}>{item.name}</span>
                    <span
                      style={{
                        color: '#64748b',
                        fontSize: '13px',
                        marginLeft: '6px',
                      }}
                    >
                      x{item.count}
                    </span>
                  </div>
                  <span style={{ fontWeight: 'bold' }}>
                    {item.price * item.count} ₺
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#475569',
                  marginBottom: '6px',
                }}
              >
                Sipariş Notu (İsteğe Bağlı):
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder='Örn: Az şekerli olsun vb.'
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  height: '60px',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              <span>Toplam Tutar:</span>
              <span style={{ color: '#2563eb' }}>{totalPrice} ₺</span>
            </div>

            <button
              onClick={handleSendOrder}
              style={{
                width: '100%',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Siparişi Mutfağa Gönder 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. MASA QR KODLARI
function QRGeneratorView() {
  const [tableCount, setTableCount] = useState(10);
  const baseUrl = window.location.origin;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .qr-card { page-break-inside: avoid; border: 2px solid #000 !important; }
        }
      `}</style>

      <div
        className='no-print'
        style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>
              🖨️ Masa QR Kod Masası & Kartları
            </h2>
            <p
              style={{
                margin: '4px 0 0 0',
                color: '#64748b',
                fontSize: '13px',
              }}
            >
              QR Kodları basıp masaların üzerine yapıştırabilirsiniz.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: '600' }}>
              Masa Sayısı:
            </label>
            <input
              type='number'
              min='1'
              max='50'
              value={tableCount}
              onChange={e =>
                setTableCount(Math.max(1, parseInt(e.target.value) || 1))
              }
              style={{
                width: '70px',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontWeight: 'bold',
              }}
            />
            <button
              onClick={() => window.print()}
              style={{
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              🖨️ Tümünü Yazdır / PDF Al
            </button>
            <Link
              to='/'
              style={{
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              Geri Dön
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        {Array.from({ length: tableCount }, (_, i) => i + 1).map(masaNum => {
          const masaTargetUrl = `${baseUrl}/masa/${masaNum}`;
          const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
            masaTargetUrl
          )}`;

          return (
            <div
              key={masaNum}
              className='qr-card'
              style={{
                backgroundColor: '#ffffff',
                border: '2px dashed #cbd5e1',
                borderRadius: '20px',
                padding: '24px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>🌲</div>
              <h3
                style={{
                  margin: '0 0 2px 0',
                  fontSize: '16px',
                  color: '#1e293b',
                }}
              >
                Çınarlı Cafe & Restorant
              </h3>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#2563eb',
                  margin: '8px 0 12px 0',
                  backgroundColor: '#eff6ff',
                  padding: '4px 16px',
                  borderRadius: '12px',
                }}
              >
                MASA {masaNum}
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '10px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  marginBottom: '12px',
                }}
              >
                <img
                  src={qrImageUrl}
                  alt={`Masa ${masaNum} QR Kodu`}
                  style={{ width: '160px', height: '160px', display: 'block' }}
                />
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: '11px',
                  color: '#64748b',
                  fontWeight: '600',
                }}
              >
                📲 Sipariş Vermek İçin Kodu Okutun
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 5. KASA & MUTFAK PANELİ
function KasaPaneli() {
  const [orders, setOrders] = useState([]);

  const refreshOrders = () => {
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    refreshOrders();
    const interval = setInterval(refreshOrders, 2000);
    window.addEventListener('storage', refreshOrders);
    window.addEventListener('orders_changed', refreshOrders);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', refreshOrders);
      window.removeEventListener('orders_changed', refreshOrders);
    };
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
    saveStoredOrders(updated);
  };

  const clearAllOrders = () => {
    if (
      window.confirm('Tüm sipariş geçmişini silmek istediğinize emin misiniz?')
    ) {
      setOrders([]);
      saveStoredOrders([]);
    }
  };

  const activeOrders = orders.filter(
    o => o.status === 'Yeni' || o.status === 'Hazırlanıyor'
  );
  const totalRevenue = orders
    .filter(o => o.status === 'Tamamlandı')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '22px',
              margin: 0,
              fontWeight: 'bold',
              color: '#0f172a',
            }}
          >
            🖥️ Mutfak & Kasa Canlı Sipariş Paneli
          </h1>
          <p
            style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}
          >
            Masalardan verilen siparişler anında buraya düşer
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link
            to='/'
            style={{
              color: '#2563eb',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            Ana Sayfa
          </Link>
          <button
            onClick={clearAllOrders}
            style={{
              padding: '8px 12px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Siparişleri Temizle
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '16px',
            borderRadius: '12px',
            borderLeft: '4px solid #2563eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}
          >
            BEKLEYEN SİPARİŞ
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginTop: '4px',
            }}
          >
            {activeOrders.length} Adet
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '16px',
            borderRadius: '12px',
            borderLeft: '4px solid #16a34a',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}
          >
            TOPLAM CİRO
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#16a34a',
              marginTop: '4px',
            }}
          >
            {totalRevenue} ₺
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            color: '#94a3b8',
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>☕</div>
          <p style={{ margin: 0 }}>Henüz sipariş yok.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {orders.map(order => (
            <div
              key={order.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '16px',
                border:
                  order.status === 'Yeni'
                    ? '2px solid #3b82f6'
                    : '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '14px',
                    }}
                  >
                    MASA {order.masaId}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    ⏰ {order.createdAt}
                  </span>
                </div>

                <div
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '12px',
                    marginBottom: '12px',
                  }}
                >
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '14px',
                        marginBottom: '6px',
                      }}
                    >
                      <span>
                        <strong>{item.count}x</strong> {item.name}
                      </span>
                      <span style={{ color: '#64748b' }}>
                        {item.price * item.count} ₺
                      </span>
                    </div>
                  ))}
                </div>

                {order.note && (
                  <div
                    style={{
                      backgroundColor: '#fffbe3',
                      border: '1px dashed #fde047',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#854d0e',
                      marginBottom: '12px',
                    }}
                  >
                    <strong>📝 Not:</strong> {order.note}
                  </div>
                )}
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  <span>Tutar:</span>
                  <span style={{ color: '#2563eb', fontSize: '18px' }}>
                    {order.total} ₺
                  </span>
                </div>

                <div>
                  {order.status === 'Yeni' && (
                    <button
                      onClick={() =>
                        updateOrderStatus(order.id, 'Hazırlanıyor')
                      }
                      style={{
                        width: '100%',
                        backgroundColor: '#eab308',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Hazırlanıyor İşaretle ⏳
                    </button>
                  )}

                  {order.status === 'Hazırlanıyor' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Tamamlandı')}
                      style={{
                        width: '100%',
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Tamamlandı & Teslim Edildi ✅
                    </button>
                  )}

                  {order.status === 'Tamamlandı' && (
                    <div
                      style={{
                        textAlign: 'center',
                        color: '#16a34a',
                        fontWeight: 'bold',
                        padding: '8px',
                        backgroundColor: '#dcfce7',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                    >
                      Sipariş Tamamlandı ✅
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
