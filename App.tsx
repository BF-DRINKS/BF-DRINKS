import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  Link,
  Route,
  Router as WouterRouter,
  Switch,
  useLocation,
} from "wouter";
import {
  ArrowRight,
  Bell,
  Box,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Filter,
  GlassWater,
  Home as HomeIcon,
  LayoutGrid,
  MapPin,
  Menu,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trash2,
  Truck,
  Camera,
  X,
} from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import NotFound from "@/pages/not-found";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import logoUrl from "@assets/LOGO_SITE_1790201895887.jpg";
import { registerOrder } from "@/lib/orders";
import { supabase } from "@/lib/supabase";
const queryClient = new QueryClient();
type Product = {
  id: number;
  name: string;
  category: string;
  sku: string;
  price: number;
  imageUrl?: string;
  available?: boolean;
};
type Category = { id: number; name: string; description: string };
const navItems = [
  { href: "/", label: "Início", icon: HomeIcon },
  { href: "/catalogo", label: "Cardápio", icon: LayoutGrid },
  { href: "/carrinho", label: "Carrinho", icon: ShoppingCart },
];

function BrandMark() {
  return (
    <span className="flex items-center gap-2" data-testid="brand-mark">
      <img
        src={logoUrl}
        alt="B&F Drinks"
        className="size-12 rounded-full object-cover ring-1 ring-primary/60"
      />
    </span>
  );
}

function Header({ cartCount }: { cartCount: number }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/92 backdrop-blur-md">
      <div className="bg-sidebar px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[.18em] text-sidebar-foreground/75">
        B&amp;F DRINKS · ENTREGA LOCAL
      </div>
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-10">
        <Link href="/" className="shrink-0" data-testid="link-brand">
          <BrandMark />
        </Link>
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Navegação principal"
        >
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="group relative flex items-center gap-2 py-3 text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
              data-testid={`link-nav-${label.toLowerCase()}`}
            >
              {label}
              {label === "Carrinho" && cartCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-accent text-[10px] font-extrabold">
                  {cartCount}
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
          <Link
            href="/gestao"
            className="flex items-center gap-2 text-sm font-semibold text-foreground/45 transition-colors hover:text-primary"
            data-testid="link-nav-gestao"
          >
            <Settings2 size={15} /> Gestão
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/carrinho"
            className="relative grid size-11 place-items-center rounded-full border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm md:hidden"
            data-testid="link-mobile-cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="grid size-11 place-items-center rounded-full border border-border bg-card md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
            data-testid="button-mobile-menu"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          className="border-t border-border bg-card px-5 py-4 md:hidden"
          aria-label="Menu mobile"
        >
          <div className="grid gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold hover:bg-secondary"
                data-testid={`link-mobile-${label.toLowerCase()}`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={17} />
                  {label}
                </span>
                {label === "Carrinho" && cartCount > 0 && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/gestao"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-foreground/60 hover:bg-secondary"
              data-testid="link-mobile-gestao"
            >
              <Settings2 size={17} /> Gestão da loja
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-xs text-sm leading-6 text-sidebar-foreground/60">
            Bebidas escolhidas para o seu momento, da nossa vizinhança para a
            sua casa.
          </p>
        </div>
        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-sidebar-foreground/45">
            A loja
          </p>
          <div className="grid gap-3 text-sm text-sidebar-foreground/70">
            <Link href="/catalogo" className="hover:text-accent">
              Cardápio
            </Link>
            <Link href="/carrinho" className="hover:text-accent">
              Seu carrinho
            </Link>
            <Link href="/checkout" className="hover:text-accent">
              Finalizar compra
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-sidebar-foreground/45">
            Atendimento
          </p>
          <div className="grid gap-3 text-sm text-sidebar-foreground/70">
            <span>Terça a quinta · 12:00 às 00:00</span>
            <span>Sexta e sábado · 12:00 às 02:00</span>
            <span>Domingo · 12:00 às 22:00</span>
            <span>Entrega em São Paulo</span>
            <a
              href="https://wa.me/5511916170864"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-accent"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366]">
                <svg
                  viewBox="0 0 32 32"
                  className="h-4 w-4 fill-white"
                  aria-hidden="true"
                >
                  <path d="M16 3C8.82 3 3 8.82 3 16c0 2.29.6 4.44 1.74 6.34L3.08 29l6.82-1.79A12.94 12.94 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3Zm0 23.67c-2.02 0-4-.54-5.71-1.56l-.41-.24-4.05 1.06 1.08-3.95-.27-.43A10.65 10.65 0 1 1 16 26.67Zm5.84-7.98c-.32-.16-1.9-.94-2.19-1.04-.29-.11-.5-.16-.71.16-.21.32-.81 1.04-.99 1.25-.18.21-.37.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.57-1.87-1.75-2.19-.18-.32-.02-.49.14-.65.14-.14.32-.37.47-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.72-.97-2.36-.26-.62-.52-.54-.71-.55h-.6c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.64s1.13 3.06 1.29 3.27c.16.21 2.22 3.39 5.38 4.76.75.32 1.34.51 1.8.65.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
                </svg>
              </span>
              Fale com a gente pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-sidebar-border px-5 py-5 text-center text-[10px] uppercase tracking-[.16em] text-sidebar-foreground/35">
        B&F Drinks · feito no bairro, pensado para durar
      </div>
    </footer>
  );
}

function Shell({
  children,
  cartCount,
}: {
  children: ReactNode;
  cartCount: number;
}) {
  return (
    <div className="grain min-h-[100dvh]">
      <Header cartCount={cartCount} />
      {children}
      <Footer />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[.22em] text-primary">
        {eyebrow}
      </p>
      <h1 className="font-display text-4xl leading-[.98] tracking-[-.035em] md:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-sidebar text-sidebar-foreground">
        <div className="mx-auto grid min-h-[610px] max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.03fr_.97fr] lg:px-10 lg:py-20">
          <div className="relative z-10 rise-in">
            <h1 className="max-w-2xl font-display text-[clamp(4rem,9vw,8rem)] leading-[.8] tracking-[-.065em]">
              B&amp;F
              <br />
              <span className="text-primary">DRINKS</span>
            </h1>
            <p className="mt-6 ml-4 max-w-xl text-base font-semibold leading-7 text-primary">
              Bateu a vontade? A B&F entrega. 🍻
              <br />
              <span className="text-lg font-bold text-white">
                A sua resenha começa aqui!
              </span>
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-extrabold uppercase tracking-[.04em] text-primary-foreground transition-transform hover:-translate-y-1 hover:shadow-lg"
                data-testid="link-hero-order"
              >
                FAZER PEDIDO <ArrowRight size={16} />
              </Link>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 rounded-full border border-accent/60 px-6 py-3.5 text-sm font-bold uppercase tracking-[.04em] text-sidebar-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                data-testid="link-hero-menu"
              >
                VER CARDÁPIO <LayoutGrid size={15} />
              </Link>
            </div>
          </div>
          <div className="relative mx-auto h-[390px] w-full max-w-[480px] rise-in-delay">
            <div className="absolute right-0 top-2 rounded-full border border-accent/35 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-accent">
              Ofertas em breve
            </div>
            <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/25" />
            <div className="absolute left-1/2 top-1/2 h-[275px] w-[275px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/35" />
            <img
              src={logoUrl}
              alt="Logo B&F Drinks"
              className="absolute left-1/2 top-1/2 size-[min(78vw,340px)] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover shadow-[0_18px_60px_rgba(0,0,0,.45)] ring-1 ring-primary/50"
            />
          </div>
        </div>
        <div className="absolute -bottom-32 -right-20 size-80 rounded-full bg-primary/30 blur-3xl" />
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10" id="manifesto">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[.22em] text-primary">
              FACILIDADE NA SUA PORTA
            </p>
            <h2 className="font-display text-4xl leading-none tracking-[-.04em] md:text-5xl">
              Peça online e receba
              <br />
              no conforto da sua casa.
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="border-t border-primary/40 pt-4">
              <p className="font-display text-2xl">01</p>
              <h3 className="mt-7 font-bold">Cardápio claro</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Uma vitrine fácil de navegar para encontrar o que combina com
                você.
              </p>
            </div>
            <div className="border-t border-primary/40 pt-4">
              <p className="font-display text-2xl">02</p>
              <h3 className="mt-7 font-bold">Ofertas da casa</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Novidades e condições especiais reunidas em um só lugar.
              </p>
            </div>
            <div className="border-t border-primary/40 pt-4">
              <p className="font-display text-2xl">03</p>
              <h3 className="mt-7 font-bold">Pedido direto</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Da escolha à entrega, você fala direto com a B&amp;F DRINKS.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-secondary/55 px-5 py-20 lg:px-10" id="ofertas">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[.22em] text-primary">
              Ofertas da B&amp;F
            </p>
            <h2 className="max-w-2xl font-display text-4xl leading-[.94] tracking-[-0.035em] md:text-6xl">
              Qualidade em cada escolha.
              <br />
              <span className="text-primary">Preço bom em cada pedido.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-6 text-muted-foreground">
              Tudo para deixar seu rolê completo.
            </p>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground transition-transform hover:-translate-y-1"
            data-testid="link-home-offers"
          >
            Ver cardápio <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
        <div className="flex flex-col justify-between gap-6 border-y border-border py-7 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-full bg-accent/25 text-primary">
              <MapPin size={19} />
            </span>
            <div>
              <p className="text-sm font-bold">
                Seu bairro, nosso ponto de partida
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Entrega própria em São Paulo e região
              </p>
            </div>
          </div>
          <button
            className="flex items-center gap-2 text-sm font-extrabold text-primary"
            onClick={() =>
              window.alert("Em breve: consulte sua região de entrega.")
            }
            data-testid="button-check-delivery"
          >
            Consultar área de entrega <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </main>
  );
}

const categories = ["Tudo", "Cervejas", "Fardos/Packs"];

const products = [
  // UNIDADES
  {
    id: 1,
    name: "Original",
    description: "Lata 269 ml",
    price: 5.0,
    category: "Cervejas",
  },
  {
    id: 2,
    name: "Amstel",
    description: "Lata 269 ml",
    price: 5.0,
    category: "Cervejas",
  },
  {
    id: 3,
    name: "Skol",
    description: "Lata 269 ml",
    price: 4.0,
    category: "Cervejas",
  },
  {
    id: 4,
    name: "Itaipava",
    description: "Lata 269 ml",
    price: 3.5,
    category: "Cervejas",
  },
  {
    id: 5,
    name: "Corona Long Neck",
    description: "Garrafa 330 ml",
    price: 12.0,
    category: "Cervejas",
  },
  {
    id: 6,
    name: "Heineken Long Neck",
    description: "Garrafa 330 ml",
    price: 10.0,
    category: "Cervejas",
  },
  {
    id: 7,
    name: "Heineken",
    description: "Lata 269 ml",
    price: 6.0,
    category: "Cervejas",
  },
  {
    id: 8,
    name: "Budweiser Long Neck",
    description: "Garrafa 330 ml",
    price: 10.0,
    category: "Cervejas",
  },
  {
    id: 9,
    name: "Smirnoff Ice Limão",
    description: "Garrafa 275 ml",
    price: 10.0,
    category: "Cervejas",
  },
  {
    id: 10,
    name: "Smirnoff Ice Raspberry",
    description: "Garrafa 275 ml",
    price: 10.0,
    category: "Cervejas",
  },
  {
    id: 11,
    name: "Império",
    description: "Lata 269 ml",
    price: 4.0,
    category: "Cervejas",
  },
  {
    id: 12,
    name: "Brahma Duplo Malte",
    description: "Lata 269 ml",
    price: 5.0,
    category: "Cervejas",
  },
  {
    id: 13,
    name: "Eisenbahn",
    description: "Lata 269 ml",
    price: 5.0,
    category: "Cervejas",
  },
  {
    id: 14,
    name: "Skol Beats Senses",
    description: "Lata 269 ml",
    price: 10.0,
    category: "Cervejas",
  },
  {
    id: 15,
    name: "Beats Red Mix",
    description: "Lata 269 ml",
    price: 6.0,
    category: "Cervejas",
  },

  // FARDOS / PACKS
  {
    id: 101,
    name: "Fardo Skol",
    description: "15 latas · 269 ml",
    price: 40.0,
    category: "Fardos/Packs",
  },
  {
    id: 102,
    name: "Fardo Amstel",
    description: "12 latas · 269 ml",
    price: 35.0,
    category: "Fardos/Packs",
  },
  {
    id: 103,
    name: "Fardo Itaipava",
    description: "12 latas · 269 ml",
    price: 32.0,
    category: "Fardos/Packs",
  },
  {
    id: 104,
    name: "Pack Corona Long Neck",
    description: "6 garrafas · 330 ml",
    price: 55.0,
    category: "Fardos/Packs",
  },
  {
    id: 105,
    name: "Pack Heineken Long Neck",
    description: "6 garrafas · 330 ml",
    price: 45.0,
    category: "Fardos/Packs",
  },
  {
    id: 106,
    name: "Pack Smirnoff Ice Limão",
    description: "6 garrafas · 275 ml",
    price: 50.0,
    category: "Fardos/Packs",
  },
  {
    id: 107,
    name: "Pack Smirnoff Ice Raspberry",
    description: "6 garrafas · 275 ml",
    price: 50.0,
    category: "Fardos/Packs",
  },
  {
    id: 108,
    name: "Fardo Império",
    description: "12 latas · 269 ml",
    price: 35.0,
    category: "Fardos/Packs",
  },
  {
    id: 109,
    name: "Fardo Brahma Duplo Malte",
    description: "15 latas · 269 ml",
    price: 55.0,
    category: "Fardos/Packs",
  },
  {
    id: 110,
    name: "Fardo Eisenbahn",
    description: "12 latas · 269 ml",
    price: 45.0,
    category: "Fardos/Packs",
  },
  {
    id: 111,
    name: "Pack Beats Red Mix",
    description: "8 latas · 269 ml",
    price: 52.0,
    category: "Fardos/Packs",
  },
  {
    id: 112,
    name: "Pack Budweiser Long Neck",
    description: "6 garrafas · 330 ml",
    price: 42.0,
    category: "Fardos/Packs",
  },
  {
    id: 113,
    name: "Pack Heineken",
    description: "8 latas · 269 ml",
    price: 40.0,
    category: "Fardos/Packs",
  },
];
const produtosFixosGestao = products.map((product) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  sku: product.description,
  price: product.price,
  imageUrl: undefined,
}));
function Catalogo({
  setCartItems,
}: {
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [category, setCategory] = useState("Tudo");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedGelo, setSelectedGelo] = useState("");
  const [selectedEnergetico, setSelectedEnergetico] = useState("");
  const [confirmedProductId, setConfirmedProductId] = useState<number | null>(
    null,
  );
  const [confirmedGelo, setConfirmedGelo] = useState("");
  const [confirmedEnergetico, setConfirmedEnergetico] = useState("");
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Erro ao carregar produtos do Supabase:", error.message);
        return;
      }

      const loadedProducts: Product[] = (data ?? []).map((item) => ({
        id: Number(item.id),
        name: item.name,
        category: item.category,
        sku: item.sku,
        price: Number(item.price),
        imageUrl: item.image_url ?? undefined,
        available: item.available !== false,
      }));

      setAdminProducts(loadedProducts);
    };

    loadProducts();
  }, []);

  const catalogProducts = [
    ...products.map((product) => {
      const savedProduct = adminProducts.find(
        (item) => String(item.id) === String(product.id),
      );

      return savedProduct
        ? {
            ...product,
            imageUrl: savedProduct.imageUrl,
            available: savedProduct.available,
          }
        : product;
    }),
    ...adminProducts
      .filter(
        (product) =>
          !products.some((item) => String(item.id) === String(product.id)),
      )
      .map((product) => ({
        ...product,
        description: product.sku === "A definir" ? "" : product.sku,
      })),
  ];

  const catalogCategories = [
    "Tudo",
    ...Array.from(new Set(catalogProducts.map((product) => product.category))),
  ];
  const filteredProducts = catalogProducts.filter((product) => {
    const matchesCategory =
      category === "Tudo" || product.category === category;

    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="mx-auto max-w-screen-2xl px-4 py-10 lg:px-8 lg:py-16">
      <SectionHeading
        eyebrow="Cardápio B&F Drinks"
        title="O seu pedido está a um clique! 🔥"
        description=""
      />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {catalogCategories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                category === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 sm:w-72">
          <Search size={17} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Buscar produto"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-20 text-center">
          <Search size={28} className="mx-auto text-primary" />
          <h2 className="mt-5 font-display text-3xl">Produto não encontrado</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tente buscar por outro nome.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const categoriaProduto = product.category
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .trim()
              .toUpperCase();

            const nomeProduto = product.name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .trim()
              .toUpperCase();

            const ehDose = categoriaProduto.includes("DOSES");

            const ehComboWhisky =
              categoriaProduto.includes("COMBO") &&
              categoriaProduto.includes("WHISKY");

            const ehComboGin =
              categoriaProduto.includes("COMBO") &&
              categoriaProduto.includes("GIN");

            const ehBallena = nomeProduto.includes("BALLENA");

            const precisaAcompanhamento =
              (ehDose || ehComboWhisky || ehComboGin) && !ehBallena;

            return (
              <article
                key={product.id}
                className="rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="relative mb-4 grid aspect-[3/4] w-full place-items-center overflow-hidden rounded-xl bg-secondary">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <GlassWater size={42} className="text-primary" />
                  )}

                  {product.available === false && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/55 p-4 text-center">
                      <span className="rounded-xl bg-black/80 px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-white">
                        🔴 Produto indisponível no momento
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-primary">
                  {product.category}
                </p>

                <h2 className="mt-2 font-display text-2xl">{product.name}</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {product.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xl font-extrabold">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </span>

                  <div className="flex flex-col items-end gap-2">
                    {precisaAcompanhamento && (
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          className="rounded-full bg-primary px-5 py-2.5 text-xs font-extrabold text-primary-foreground transition-transform hover:-translate-y-0.5"
                          onClick={() => {
                            setSelectedGelo("");
                            setSelectedEnergetico("");
                            setSelectedProduct(product);
                          }}
                        >
                          ESCOLHER GELO E ENERGÉTICO
                        </button>

                        <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          Obrigatório
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={
                        product.available === false ||
                        (precisaAcompanhamento &&
                          (confirmedProductId !== product.id ||
                            !confirmedGelo ||
                            !confirmedEnergetico))
                      }
                      className={`rounded-full px-5 py-2.5 text-xs font-extrabold transition-all ${
                        product.available === false
                          ? "bg-gray-500 text-gray-300 opacity-60 cursor-not-allowed"
                          : precisaAcompanhamento &&
                              (confirmedProductId !== product.id ||
                                !confirmedGelo ||
                                !confirmedEnergetico)
                            ? "bg-gray-500 text-gray-300 opacity-40 cursor-not-allowed"
                            : "bg-primary text-primary-foreground hover:-translate-y-0.5"
                      }`}
                      onClick={() => {
                        if (product.available === false) return;

                        if (
                          precisaAcompanhamento &&
                          (confirmedProductId !== product.id ||
                            !confirmedGelo ||
                            !confirmedEnergetico)
                        ) {
                          setSelectedProduct(product);
                          return;
                        }

                        const cartId = `${product.id}-${Date.now()}`;

                        setCartItems((items) => [
                          ...items,
                          {
                            ...product,
                            id: cartId,
                            cartId,
                            quantity: 1,
                            ...(precisaAcompanhamento
                              ? {
                                  gelo: confirmedGelo,
                                  energetico: confirmedEnergetico,
                                  description: `Gelo: ${confirmedGelo} • Energético: ${confirmedEnergetico}`,
                                }
                              : {}),
                          },
                        ]);

                        if (precisaAcompanhamento) {
                          setSelectedGelo("");
                          setSelectedEnergetico("");
                        }
                      }}
                    >
                      {product.available === false
                        ? "INDISPONÍVEL"
                        : product.category
                              .trim()
                              .toUpperCase()
                              .includes("DOSES")
                          ? "ADICIONAR DOSE"
                          : "ADICIONAR"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl">
              Escolha os acompanhamentos
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {selectedProduct.name}
            </p>

            <p className="mt-1 text-xs text-primary">Acompanhamentos grátis</p>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold">
                  Escolha o sabor do gelo
                </span>

                <select
                  value={selectedGelo}
                  onChange={(event) => setSelectedGelo(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm"
                >
                  <option value="">Selecione o gelo</option>

                  {adminProducts
                    .filter((product) =>
                      product.category
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .trim()
                        .toUpperCase()
                        .includes("GELO"),
                    )
                    .map((gelo) => (
                      <option key={gelo.id} value={gelo.name}>
                        {gelo.name}
                      </option>
                    ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold">
                  Escolha o sabor do energético
                </span>

                <select
                  value={selectedEnergetico}
                  onChange={(event) =>
                    setSelectedEnergetico(event.target.value)
                  }
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm"
                >
                  <option value="">Selecione o energético</option>

                  {adminProducts
                    .filter((product) => {
                      const categoria = product.category
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .trim()
                        .toUpperCase();

                      const nomeDose = selectedProduct.name
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .trim()
                        .toUpperCase();

                      const nomeEnergetico = product.name
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .trim()
                        .toUpperCase();

                      if (!categoria.includes("ENERGETICO")) return false;

                      if (nomeDose.includes("VIBE")) {
                        return (
                          nomeEnergetico.includes("VIBE") ||
                          nomeEnergetico.includes("BALLY")
                        );
                      }

                      if (
                        nomeDose.includes("RED BULL") ||
                        nomeDose.includes("REDBULL")
                      ) {
                        return (
                          nomeEnergetico.includes("RED BULL") ||
                          nomeEnergetico.includes("REDBULL")
                        );
                      }

                      if (nomeDose.includes("BALLY")) {
                        return nomeEnergetico.includes("BALLY");
                      }

                      return true;
                    })
                    .map((energetico) => (
                      <option key={energetico.id} value={energetico.name}>
                        {energetico.name}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <div className="mt-6">
              <button
                type="button"
                disabled={!selectedGelo || !selectedEnergetico}
                onClick={() => {
                  if (
                    !selectedProduct ||
                    !selectedGelo ||
                    !selectedEnergetico
                  ) {
                    return;
                  }

                  setConfirmedProductId(selectedProduct.id);
                  setConfirmedGelo(selectedGelo);
                  setConfirmedEnergetico(selectedEnergetico);

                  setSelectedProduct(null);
                  setSelectedGelo("");
                  setSelectedEnergetico("");
                }}
                className="w-full rounded-full bg-primary px-4 py-3 text-xs font-extrabold text-primary-foreground disabled:bg-gray-500 disabled:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                CONFIRMAR
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
function Cart({
  cartItems,
  setCartItems,
}: {
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const increase = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decrease = (id: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const remove = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <main className="mx-auto min-h-[560px] max-w-7xl px-5 py-16 lg:px-10 lg:py-24">
      <SectionHeading
        eyebrow="Seu carrinho"
        title="Revise seu pedido."
        description="Confira os produtos escolhidos antes de continuar."
      />

      {cartItems.length === 0 ? (
        <div className="line-art flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-border bg-card px-5 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-secondary text-primary">
            <ShoppingBag size={26} />
          </span>

          <h2 className="mt-6 font-display text-3xl">
            Seu carrinho está vazio.
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Escolha seus produtos no catálogo e eles aparecerão aqui.
          </p>

          <Link
            href="/catalogo"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground hover:-translate-y-0.5 transition-transform"
          >
            Explorar catálogo <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl">{item.name}</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>

                    <p className="mt-2 font-extrabold text-primary">
                      R$ {item.price.toFixed(2).replace(".", ",")}+{" "}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="text-sm font-bold text-muted-foreground hover:text-destructive"
                  >
                    Remover
                  </button>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decrease(item.id)}
                      className="grid size-9 place-items-center rounded-full border border-border font-bold"
                    >
                      −
                    </button>

                    <span className="min-w-6 text-center font-extrabold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => increase(item.id)}
                      className="grid size-9 place-items-center rounded-full border border-border font-bold"
                    >
                      +
                    </button>
                  </div>

                  <strong className="text-lg">
                    R${" "}
                    {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                  </strong>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl">Resumo do pedido</h2>

            <div className="mt-6 flex items-center justify-between border-b border-border pb-4">
              <span className="text-sm text-muted-foreground">Produtos</span>

              <strong>R$ {total.toFixed(2).replace(".", ",")}</strong>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-extrabold">Total</span>

              <strong className="text-xl text-primary">
                R$ {total.toFixed(2).replace(".", ",")}
              </strong>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground"
            >
              Continuar pedido
              <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

const checkoutSteps: Array<[string, string, typeof MapPin, string]> = [
  ["01", "Endereço de entrega", MapPin, "Onde devemos entregar?"],
  ["02", "Forma de entrega", Truck, "Escolha a janela que funciona para você"],
  ["03", "Pagamento", CreditCard, "Pix ou cartão, com segurança"],
];

function Checkout({
  cartItems,
  setCartItems,
}: {
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [nome, setNome] = useState("");
  const [testeSupabase, setTesteSupabase] = useState("Verificando conexão...");
  useEffect(() => {
    const testarSupabase = async () => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 10000);

      try {
        const resposta = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/health`,
          {
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            signal: controller.signal,
          },
        );

        if (!resposta.ok) {
          throw new Error(`Supabase respondeu com HTTP ${resposta.status}`);
        }

        setTesteSupabase("Conectado");
      } catch (erro) {
        console.error("Erro no teste do Supabase:", erro);
        setTesteSupabase(
          erro instanceof DOMException && erro.name === "AbortError"
            ? "Erro: Tempo esgotado: sem resposta do Supabase"
            : "Erro: " + (erro instanceof Error ? erro.message : String(erro)),
        );
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    testarSupabase();
  }, []);
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [complemento, setComplemento] = useState("");
  const [dadosCarregados, setDadosCarregados] = useState(false);

  useEffect(() => {
    try {
      const dadosSalvos = localStorage.getItem("bf-drinks-endereco");
      if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        setTelefone(dados.telefone ?? "");
        setCep(dados.cep ?? "");
        setEndereco(dados.endereco ?? "");
        setNumero(dados.numero ?? "");
        setBairro(dados.bairro ?? "");
        setComplemento(dados.complemento ?? "");
      }
    } catch (erro) {
      console.error("Não foi possível carregar os dados salvos:", erro);
    }
    setDadosCarregados(true);
  }, []);

  useEffect(() => {
    if (!dadosCarregados) return;

    localStorage.setItem(
      "bf-drinks-endereco",
      JSON.stringify({
        telefone,
        cep,
        endereco,
        numero,
        bairro,
        complemento,
      }),
    );
  }, [dadosCarregados, telefone, cep, endereco, numero, bairro, complemento]);
  const [pagamento, setPagamento] = useState("Pix");
  const [entrega, setEntrega] = useState<number | null>(null);
  const [distanciaEntrega, setDistanciaEntrega] = useState<number | null>(null);
  const [calculandoEntrega, setCalculandoEntrega] = useState(false);
  const [registrandoPedido, setRegistrandoPedido] = useState(false);
  const [chaveIdempotencia, setChaveIdempotencia] = useState(
    () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-pedido`,
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const calcularEntrega = async () => {
    if (!cep) {
      window.alert("Digite o CEP antes de calcular.");
      return;
    }

    setCalculandoEntrega(true);

    try {
      const cepLimpo = cep.replace(/\D/g, "");

      if (cepLimpo.length !== 8) {
        window.alert("Digite um CEP válido com 8 números.");
        setEntrega(null);
        return;
      }

      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
      );

      const dados = await resposta.json();

      if (dados.erro) {
        window.alert("CEP não encontrado. Confira o CEP e tente novamente.");
        setEntrega(null);
        return;
      }

      if (dados.logradouro) {
        setEndereco(dados.logradouro);
      }

      if (dados.bairro) {
        setBairro(dados.bairro);
      }

      const enderecoCompleto = `${dados.logradouro || ""}, ${dados.bairro || ""}, ${dados.localidade || ""}, ${dados.uf || ""}, Brasil`;

      const respostaGeo = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&country=Brazil&city=${encodeURIComponent(
          dados.localidade || "",
        )}&state=${encodeURIComponent(dados.uf || "")}&street=${encodeURIComponent(
          dados.logradouro || "",
        )}`,
      );

      const dadosGeo = await respostaGeo.json();

      if (!dadosGeo.length) {
        window.alert(
          "Encontramos o CEP, mas não conseguimos calcular a distância desse endereço.",
        );
        setEntrega(null);
        return;
      }

      const latitudeCliente = Number(dadosGeo[0].lat);
      const longitudeCliente = Number(dadosGeo[0].lon);

      const latitudeAdega = -23.448;
      const longitudeAdega = -46.684;

      const toRad = (valor: number) => (valor * Math.PI) / 180;

      const distanciaKm =
        6371 *
        2 *
        Math.asin(
          Math.sqrt(
            Math.sin(toRad(latitudeCliente - latitudeAdega) / 2) ** 2 +
              Math.cos(toRad(latitudeAdega)) *
                Math.cos(toRad(latitudeCliente)) *
                Math.sin(toRad(longitudeCliente - longitudeAdega) / 2) ** 2,
          ),
        );
      setDistanciaEntrega(distanciaKm);
      if (distanciaKm <= 2) {
        setEntrega(3);
      } else if (distanciaKm <= 4) {
        setEntrega(5);
      } else if (distanciaKm <= 6) {
        setEntrega(8);
      } else {
        setEntrega(null);
        window.alert(
          `Esse endereço fica a ${distanciaKm.toFixed(1)} km da B&F Drinks e está fora da nossa área de entrega.`,
        );
        return;
      }
    } catch (erro) {
      console.error(erro);
      window.alert("Não foi possível consultar o CEP. Tente novamente.");
      setEntrega(null);
    } finally {
      setCalculandoEntrega(false);
    }
  };
  const total = subtotal + (entrega ?? 0);

  const finalizarPedido = async () => {
    if (
      !nome ||
      !telefone ||
      !cep ||
      !endereco ||
      !numero ||
      !bairro ||
      entrega === null ||
      cartItems.length === 0
    ) {
      window.alert("Preencha todos os dados de entrega.");
      return;
    }

    const janelaWhatsApp = window.open("about:blank", "_blank");

    if (!janelaWhatsApp) {
      window.alert(
        "O navegador bloqueou a nova janela. Permita pop-ups para enviar o pedido.",
      );
      return;
    }

    setRegistrandoPedido(true);

    try {
      const registro = {
        numeroPedido: Date.now().toString().slice(-6),
      };
      const mensagem =
        `🍻 *B&F DRINKS | PEDIDO ONLINE* 🍻\n\n` +
        `Olá, equipe B&F Drinks! Tudo bem?\n` +
        `Acabei de fazer um pedido pelo site e gostaria de confirmar, por favor.\n\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🧾 *PEDIDO Nº ${registro.numeroPedido}*\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `👤 *DADOS DO CLIENTE*\n` +
        `Nome: ${nome}\n` +
        `WhatsApp: ${telefone}\n\n` +
        `📍 *ENDEREÇO DE ENTREGA*\n` +
        `${endereco}, nº ${numero}\n` +
        `Bairro: ${bairro}\n` +
        `CEP: ${cep}\n` +
        `Complemento: ${complemento || "Não informado"}\n\n` +
        `🛒 *MEU PEDIDO*\n` +
        cartItems
          .map(
            (item) =>
              `• ${item.name} — ${item.quantity} un. — R$ ${(
                item.price * item.quantity
              )
                .toFixed(2)
                .replace(".", ",")}` +
              `${item.gelo ? `\n   🧊 Gelo: ${item.gelo}` : ""}` +
              `${item.energetico ? `\n   ⚡ Energético: ${item.energetico}` : ""}`,
          )
          .join("\n") +
        `\n\n━━━━━━━━━━━━━━━━━━\n` +
        `💰 *RESUMO DO PEDIDO*\n` +
        `Produtos: R$ ${subtotal.toFixed(2).replace(".", ",")}\n` +
        `🚚 Taxa de entrega: R$ ${entrega.toFixed(2).replace(".", ",")}\n` +
        `*TOTAL: R$ ${total.toFixed(2).replace(".", ",")}*\n\n` +
        `💳 *Forma de pagamento:* ${pagamento}\n\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🏍️ *Previsão de entrega: 15 a 35 min*\n\n` +
        `Obrigada pela atenção! 💛\n` +
        `*B&F DRINKS — Sua resenha começa aqui!* 🍻`;
      const whatsapp = "5511916170864";
      janelaWhatsApp.location.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
        mensagem,
      )}`;

      window.alert("Pedido confirmado! Obrigada por escolher a B&F! 🥳🍻");

      setCartItems([]);
      window.localStorage.removeItem("bf-cart");
    } catch (erro) {
      janelaWhatsApp.close();
      window.alert(
        erro instanceof Error
          ? erro.message
          : "Não foi possível registrar o pedido. Tente novamente.",
      );
    } finally {
      setRegistrandoPedido(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20">
      <SectionHeading
        eyebrow="Finalizar pedido"
        title="Últimos detalhes para concluir seu pedido."
        description="Preencha seus dados para finalizar o pedido."
      />
      <p className="mb-4 text-sm">Teste Supabase: {testeSupabase}</p>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
          <h2 className="font-display text-2xl">Dados para entrega</h2>

          <div className="mt-6 grid gap-5">
            <div>
              <label className="text-sm font-bold">Nome *</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-bold">WhatsApp *</label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-[1fr_120px]">
              <div>
                <label className="text-sm font-bold">CEP *</label>
                <input
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-bold">Rua / Avenida *</label>
                <input
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Nome da rua"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-sm font-bold">Número *</label>
                <input
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="123"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold">Bairro *</label>
              <input
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Seu bairro"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-bold">Complemento</label>
              <input
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                placeholder="Apartamento, casa, referência..."
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm font-bold">Forma de pagamento</label>

              <select
                value={pagamento}
                onChange={(e) => setPagamento(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none"
              >
                <option>Pix</option>
                <option>Cartão de crédito</option>
                <option>Cartão de débito</option>
                <option>Dinheiro</option>
              </select>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={calcularEntrega}
                disabled={calculandoEntrega}
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {calculandoEntrega
                  ? "CALCULANDO ENTREGA..."
                  : "CALCULAR TAXA DE ENTREGA"}
              </button>

              {entrega !== null && (
                <div className="mt-3 rounded-xl border border-border bg-background px-4 py-3">
                  <div>
                    <p className="text-sm font-bold">
                      📍 Distância:{" "}
                      {distanciaEntrega !== null
                        ? `${distanciaEntrega.toFixed(1).replace(".", ",")} km`
                        : "--"}
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      🚚 Taxa de entrega: R${" "}
                      {(entrega ?? 0).toFixed(2).replace(".", ",")}
                    </p>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Taxa calculada conforme a distância do endereço.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-sidebar p-7 text-sidebar-foreground">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Resumo</h2>

            <ClipboardList size={19} className="text-accent" />
          </div>

          <div className="my-7 border-y border-sidebar-border py-6 text-sm">
            <div className="flex justify-between">
              <span className="text-sidebar-foreground/60">Produtos</span>

              <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
            </div>

            <div className="mt-4 flex justify-between">
              <span className="text-sidebar-foreground/60">Entrega</span>

              <span>R$ {(entrega ?? 0).toFixed(2).replace(".", ",")}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold">
            <span>Total do pedido</span>

            <span>R$ {total.toFixed(2).replace(".", ",")}</span>
          </div>

          <button
            type="button"
            onClick={finalizarPedido}
            disabled={registrandoPedido}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-yellow-500 px-5 py-4 text-base font-extrabold text-black shadow-lg transition hover:bg-[#D4AF37] disabled:cursor-wait disabled:opacity-60"
          >
            {registrandoPedido ? "REGISTRANDO PEDIDO..." : "Enviar pedido"}
            <ArrowRight size={16} />
          </button>
          <div className="mt-4 text-center text-sm font-bold">
            🏍️ Entrega: 15 a 35 min&nbsp;&nbsp;·&nbsp;&nbsp;🛍️ Retirada: 1 min
          </div>
          <p className="mt-4 text-center text-[11px] leading-5 text-sidebar-foreground/50">
            Seu pedido será enviado para confirmação pelo WhatsApp.
          </p>
        </aside>
      </div>
    </main>
  );
}

function GestaoProtegida() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [autorizado, setAutorizado] = useState(false);
  const [erro, setErro] = useState(false);

  const entrar = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });

    if (error) {
      setErro(true);
      return;
    }

    setAutorizado(true);
    setErro(false);
  };
  if (autorizado) {
    return <Gestao />;
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="mb-2 text-2xl font-bold">Área administrativa</h1>
        <p className="mb-5 text-sm text-muted-foreground">
          Digite a senha para acessar a Gestão da B&F Drinks.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail do Supabase"
          className="mb-3 w-full rounded-xl border border-border bg-background px-4 py-3"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail do Supabase"
          className="mb-3 w-full rounded-xl border border-border bg-background px-4 py-3"
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") entrar();
          }}
          placeholder="Senha de acesso"
          className="mb-3 w-full rounded-xl border border-border bg-background px-4 py-3"
        />

        {erro && (
          <p className="mb-3 text-sm text-red-500">
            Senha incorreta. Tente novamente.
          </p>
        )}

        <button
          type="button"
          onClick={entrar}
          className="w-full rounded-xl bg-[#D4AF37] px-4 py-3 font-bold text-black"
        >
          ENTRAR
        </button>
      </div>
    </main>
  );
}
function Gestao() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Erro ao carregar produtos do Supabase:", error.message);
      }

      const supabaseProducts: Product[] = (data ?? []).map((item) => ({
        id: Number(item.id),
        name: item.name,
        category: item.category,
        sku: item.sku,
        price: Number(item.price),
        imageUrl: item.image_url ?? undefined,
        available: item.available !== false,
      }));

      let localProducts: Product[] = [];

      try {
        const saved = JSON.parse(
          localStorage.getItem("bf-admin-products") || "[]",
        );

        if (Array.isArray(saved)) {
          localProducts = saved;
        }
      } catch {
        localProducts = [];
      }

      const mergedProducts = [...supabaseProducts];

      localProducts.forEach((localProduct) => {
        const alreadyExists = mergedProducts.some(
          (item) => String(item.id) === String(localProduct.id),
        );

        if (!alreadyExists) {
          mergedProducts.push(localProduct);
        }
      });

      setProducts(mergedProducts);
    };

    loadProducts();
  }, []);

  // daqui continua o restante do seu código...
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean)),
  );
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSku, setProductSku] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productAvailable, setProductAvailable] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  const filteredProducts = products.filter((product) => {
    const termo = searchProduct.trim().toLowerCase();

    if (!termo) return true;

    return (
      String(product.name ?? "")
        .toLowerCase()
        .includes(termo) ||
      String(product.category ?? "")
        .toLowerCase()
        .includes(termo) ||
      String(product.sku ?? "")
        .toLowerCase()
        .includes(termo)
    );
  });
  useEffect(() => {
    localStorage.setItem("bf-admin-products", JSON.stringify(products));
  }, [products]);
  const addProduct = async () => {
    if (!productName.trim()) return;

    const existingProduct = products.find((item) => item.id === editingId);

    const nextProduct = {
      id: editingId ?? Date.now(),
      name: productName.trim(),
      category: productCategory.trim() || "Sem categoria",
      sku: productSku.trim() || "A definir",
      price: Number(productPrice.replace(",", ".")) || 0,
      imageUrl: existingProduct?.imageUrl,
      available: productAvailable,
    };

    const { error } = await supabase.from("products").upsert({
      id: nextProduct.id,
      name: nextProduct.name,
      category: nextProduct.category,
      sku: nextProduct.sku,
      price: nextProduct.price,
      image_url: nextProduct.imageUrl ?? null,
      available: nextProduct.available,
    });

    if (error) {
      alert("Erro ao salvar produto: " + error.message);
      return;
    }

    setProducts((items) =>
      editingId === null
        ? [...items, nextProduct]
        : items.map((item) => (item.id === editingId ? nextProduct : item)),
    );

    setProductName("");
    setProductCategory("");
    setProductSku("");
    setProductPrice("");
    setEditingId(null);
    setShowProductForm(false);

    alert("Produto salvo no banco de dados!");
  };
  const editProduct = (product: Product) => {
    setEditingId(product.id);
    setProductName(product.name);
    setProductCategory(product.category);
    setProductSku(product.sku);
    setProductPrice(String(product.price ?? ""));
    setProductImage(null);
    setShowProductForm(true);
  };
  const addCategory = () => {
    if (!categoryName.trim()) return;
    setLocalCategories((items) => [
      ...items,
      {
        id: Date.now(),
        name: categoryName.trim(),
        description: categoryDescription.trim() || "Categoria da loja",
      },
    ]);
    setCategoryName("");
    setCategoryDescription("");
    setShowCategoryForm(false);
  };
  return (
    <main className="bg-secondary/25">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-10 lg:py-14">
        <div className="flex flex-col justify-between gap-5 border-b border-border pb-8 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[.22em] text-primary">
              Painel da loja
            </p>
            <h1 className="font-display text-4xl tracking-[-.035em] md:text-5xl">
              Gestão B&F
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Um espaço simples para a sua seleção ganhar forma.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-bold text-primary">
            <span className="size-2 rounded-full bg-accent" />
            Modo de preparação
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">
              Produtos ativos
            </p>
            <p className="mt-3 font-display text-4xl">{products.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">
              Categorias
            </p>
            <p className="mt-3 font-display text-4xl">{categories.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">
              Status da loja
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">
              <span className="size-2 rounded-full bg-accent" />
              Em preparação
            </p>
          </div>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border p-6">
              <div>
                <h2 className="font-display text-2xl">Produtos</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Cadastre e organize o que aparece no catálogo.
                </p>
                <div className="relative mt-4">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    value={searchProduct}
                    onChange={(e) => {
                      setSearchProduct(e.target.value);
                    }}
                    placeholder="Buscar produto..."
                    className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingId(null);
                  setProductName("");
                  setProductCategory("");
                  setProductSku("");
                  setProductPrice("");
                  setShowProductForm(!showProductForm);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-extrabold text-primary-foreground hover:-translate-y-0.5 transition-transform"
                data-testid="button-add-product"
              >
                <Plus size={15} /> Adicionar produto
              </button>
            </div>

            {showProductForm && (
              <div className="border-b border-border bg-secondary/45 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-xs font-bold">
                    Nome do produto
                    <input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="h-10 rounded-lg border border-border bg-card px-3 font-normal"
                      placeholder="Ex.: Heineken lata"
                    />
                  </label>

                  <label className="grid gap-2 text-xs font-bold">
                    Categoria
                    <input
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="h-10 rounded-lg border border-border bg-card px-3 font-normal"
                      placeholder="Ex.: Cervejas"
                    />
                  </label>

                  <label className="grid gap-2 text-xs font-bold">
                    SKU
                    <input
                      value={productSku}
                      onChange={(e) => setProductSku(e.target.value)}
                      className="h-10 rounded-lg border border-border bg-card px-3 font-normal"
                      placeholder="Código do produto"
                    />
                  </label>

                  <label className="grid gap-2 text-xs font-bold">
                    Preço
                    <input
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      className="h-10 rounded-lg border border-border bg-card px-3 font-normal"
                      placeholder="Ex.: 10,00"
                    />
                  </label>
                </div>
                <label className="mt-4 grid gap-2 text-xs font-bold">
                  Foto do produto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProductImage(e.target.files?.[0] ?? null)
                    }
                    className="text-sm"
                  />
                </label>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={addProduct}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                    data-testid="button-save-product"
                  >
                    Salvar produto
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setShowProductForm(false);
                    }}
                    className="rounded-full border border-border px-4 py-2 text-xs font-bold"
                    data-testid="button-cancel-product"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
            {filteredProducts.length === 0 ? (
              <div className="flex min-h-[270px] flex-col items-center justify-center px-6 text-center">
                <div className="grid size-14 place-items-center rounded-full bg-secondary text-primary">
                  <Box size={23} />
                </div>
                <h3 className="mt-5 font-display text-2xl">
                  Nenhum produto cadastrado
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  Quando você adicionar uma garrafa, ela aparecerá aqui para
                  edição, disponibilidade e remoção.
                </p>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="mt-5 text-xs font-extrabold text-primary underline underline-offset-4"
                  data-testid="button-empty-add-product"
                >
                  Cadastrar o primeiro produto
                </button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <div
                    key={`${product.id}-${product.name}`}
                    className="flex items-center justify-between gap-4 p-5"
                  >
                    <div>
                      <p className="font-bold">{product.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {product.category} · {product.sku}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={async () => {
                          const novoStatus = product.available === false;

                          const { error } = await supabase
                            .from("products")
                            .update({ available: novoStatus })
                            .eq("id", product.id);

                          if (error) {
                            alert(
                              "Erro ao alterar disponibilidade: " +
                                error.message,
                            );
                            return;
                          }

                          setProducts((items) =>
                            items.map((item) =>
                              String(item.id) === String(product.id)
                                ? { ...item, available: novoStatus }
                                : item,
                            ),
                          );
                        }}
                        className="rounded-full border border-border px-3 py-2 text-xs font-semibold hover:border-primary"
                      >
                        {product.available === false
                          ? "🔴 Indisponível"
                          : "🟢 Disponível"}
                      </button>
                      <label
                        className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-secondary"
                        title="Adicionar foto"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const path = `${product.id}-${Date.now()}-${file.name}`;
                            const { error } = await supabase.storage
                              .from("FOTOS-PRODUTOS")
                              .upload(path, file);

                            if (error) {
                              alert("Erro ao enviar foto: " + error.message);
                              return;
                            }

                            const { data } = supabase.storage
                              .from("FOTOS-PRODUTOS")
                              .getPublicUrl(path);
                            const { error: photoError } = await supabase
                              .from("products")
                              .upsert({
                                id: product.id,
                                name: product.name,
                                category: product.category,
                                sku: product.sku ?? product.description ?? "",
                                price: product.price,
                                image_url: data.publicUrl,
                              });

                            if (photoError) {
                              alert(
                                "Erro ao salvar foto no banco: " +
                                  photoError.message,
                              );
                              return;
                            }
                            const updatedProducts = products.map((item) =>
                              String(item.id) === String(product.id)
                                ? { ...item, imageUrl: data.publicUrl }
                                : item,
                            );

                            const productFound = updatedProducts.some(
                              (item) => String(item.id) === String(product.id),
                            );

                            if (!productFound) {
                              alert(
                                "Produto não encontrado para vincular a foto.",
                              );
                              return;
                            }

                            localStorage.setItem(
                              "bf-admin-products",
                              JSON.stringify(updatedProducts),
                            );

                            setProducts(updatedProducts);
                            window.dispatchEvent(
                              new Event("bf-products-updated"),
                            );

                            alert("Foto salva no produto!");
                            e.target.value = "";
                          }}
                        />
                        <Camera size={15} />
                      </label>
                      <button
                        className="grid size-9 place-items-center rounded-full hover:bg-secondary"
                        aria-label={`Editar ${product.name}`}
                        onClick={() => editProduct(product)}
                        data-testid={`button-edit-product-${product.id}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="grid size-9 place-items-center rounded-full text-destructive hover:bg-destructive/10"
                        aria-label={`Remover ${product.name}`}
                        onClick={() =>
                          setProducts((items) =>
                            items.filter((item) => item.id !== product.id),
                          )
                        }
                        data-testid={`button-delete-product-${product.id}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="h-fit rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-6">
              <div>
                <h2 className="font-display text-2xl">Categorias</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Organize a navegação.
                </p>
              </div>
              <button
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                className="grid size-9 place-items-center rounded-full border border-border hover:border-primary hover:text-primary"
                aria-label="Adicionar categoria"
                data-testid="button-add-category"
              >
                <Plus size={16} />
              </button>
            </div>
            {showCategoryForm && (
              <div className="border-b border-border bg-secondary/45 p-5">
                <label className="grid gap-2 text-xs font-bold">
                  Nome
                  <input
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="h-10 rounded-lg border border-border bg-card px-3 font-normal outline-none focus:border-primary"
                    placeholder="Ex.: vinhos"
                    data-testid="input-category-name"
                  />
                </label>
                <label className="mt-3 grid gap-2 text-xs font-bold">
                  Descrição
                  <input
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    className="h-10 rounded-lg border border-border bg-card px-3 font-normal outline-none focus:border-primary"
                    placeholder="Opcional"
                    data-testid="input-category-description"
                  />
                </label>
                <button
                  onClick={addCategory}
                  className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                  data-testid="button-save-category"
                >
                  Salvar categoria
                </button>
              </div>
            )}
            {categories.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <LayoutGrid
                  className="mx-auto text-muted-foreground/50"
                  size={25}
                />
                <p className="mt-4 text-sm font-bold">
                  Nenhuma categoria cadastrada
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  As categorias aparecem automaticamente conforme você cadastra
                  os produtos.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-5"
                  >
                    <div>
                      <p className="text-sm font-bold">{category}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Categoria dos produtos cadastrados.
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        const newName = prompt(
                          "Novo nome da categoria:",
                          category,
                        );

                        if (
                          !newName ||
                          !newName.trim() ||
                          newName.trim() === category
                        )
                          return;

                        const renamedCategory = newName.trim();
                        const { error } = await supabase
                          .from("products")
                          .update({ category: renamedCategory })
                          .eq("category", category);

                        if (error) {
                          alert(
                            "Erro ao renomear a categoria: " + error.message,
                          );
                          return;
                        }

                        setProducts((items) =>
                          items.map((product) =>
                            product.category === category
                              ? { ...product, category: renamedCategory }
                              : product,
                          ),
                        );
                      }}
                      className="rounded-full border border-border px-3 py-2 text-sm hover:border-primary"
                    >
                      ✏️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-5 text-sm text-muted-foreground">
          <Bell size={17} className="mt-0.5 shrink-0 text-primary" />
          <p>
            <strong className="text-foreground">Próximo passo:</strong> cadastre
            as categorias e produtos da sua curadoria. Tudo nesta tela é salvo
            apenas neste navegador por enquanto.
          </p>
        </div>
      </div>
    </main>
  );
}

function Router({
  cartItems,
  setCartItems,
}: {
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [location] = useLocation();

  return (
    <ErrorBoundary resetKey={location}>
      <Shell
        cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
      >
        <Switch>
          <Route path="/" component={Home} />

          <Route
            path="/catalogo"
            component={() => <Catalogo setCartItems={setCartItems} />}
          />

          <Route
            path="/carrinho"
            component={() => (
              <Cart cartItems={cartItems} setCartItems={setCartItems} />
            )}
          />
          <Route
            path="/checkout"
            component={() => (
              <Checkout cartItems={cartItems} setCartItems={setCartItems} />
            )}
          />
          <Route path="/gestao" component={GestaoProtegida} />
          <Route component={NotFound} />
        </Switch>
      </Shell>
    </ErrorBoundary>
  );
}

function App() {
  const [cartItems, setCartItems] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("bf-cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("bf-cart", JSON.stringify(cartItems));
  }, [cartItems]);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router cartItems={cartItems} setCartItems={setCartItems} />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
