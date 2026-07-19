const fallbackApiUrl = 'http://localhost:4000';

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? fallbackApiUrl;

type ApiResponse<T> = {
  data: T;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  sortOrder: number;
  isFeatured: boolean;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  badge: string | null;
  discountPercent: number | null;
};

export type Product = {
  id: string;
  categoryId: string;
  brandId: string | null;
  name: string;
  slug: string;
  description: string;
  packageSize: string;
  pricePiasters: number;
  imageUrl: string | null;
  inStock: boolean;
  isPopular: boolean;
  price: {
    amount: number;
    currency: string;
    formatted: string;
  };
  category?: Category;
  brand?: Brand | null;
};

async function getJson<T>(path: string) {
  const response = await fetch(`${apiUrl}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed with ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;

  return payload.data;
}

export function getCategories() {
  return getJson<Category[]>('/categories');
}

export function getBrands() {
  return getJson<Brand[]>('/brands');
}

export function getOffers() {
  return getJson<Offer[]>('/offers');
}

export function getProducts() {
  return getJson<Product[]>('/products');
}

type GetProductsParams = {
  brandId?: string;
  categoryId?: string;
  query?: string;
};

export function getFilteredProducts(params: GetProductsParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.categoryId) {
    searchParams.set('categoryId', params.categoryId);
  }

  if (params.brandId) {
    searchParams.set('brandId', params.brandId);
  }

  if (params.query) {
    searchParams.set('query', params.query);
  }

  const queryString = searchParams.toString();

  return getJson<Product[]>(`/products${queryString ? `?${queryString}` : ''}`);
}

export function getProduct(productId: string) {
  return getJson<Product>(`/products/${productId}`);
}

export function resolveImageUrl(imageUrl: string | null | undefined) {
  if (!imageUrl) {
    return null;
  }

  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  return `${apiUrl}${imageUrl}`;
}
