const fallbackApiUrl = 'http://localhost:4000';

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? fallbackApiUrl;

type ApiResponse<T> = {
  data: T;
};

export type Customer = {
  id: string;
  fullName: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthSession = {
  customer: Customer;
  token: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  subcategories: Subcategory[];
};

export type Subcategory = {
  id: string;
  categoryId: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  children?: Subcategory[];
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
  subcategoryId: string | null;
  brandId: string | null;
  name: string;
  slug: string;
  description: string;
  packageSize: string;
  unitLabel?: string;
  pricePiasters: number;
  imageUrl: string | null;
  inStock: boolean;
  isPopular: boolean;
  price: {
    amount: number;
    currency: string;
    formatted: string;
  };
  units: ProductUnit[];
  category?: Category;
  subcategory?: Subcategory | null;
  brand?: Brand | null;
};

export type ProductUnit = {
  id: string;
  label: string;
  pricePiasters: number;
  isDefault: boolean;
  sortOrder: number;
  price: {
    amount: number;
    currency: string;
    formatted: string;
  };
};

export type PrescriptionUpload = {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  orderId: string | null;
  createdAt: string;
};

export type Address = {
  id: string;
  addressName: string;
  additionalPhone: string | null;
  apartment: string | null;
  area: string;
  building: string;
  city: string;
  floor: string | null;
  fullName: string;
  isDefault: boolean;
  landmark: string | null;
  phone: string;
  street: string;
  createdAt: string;
  updatedAt: string;
};

export type Branch = {
  id: string;
  address: string;
  hours: string;
  isActive: boolean;
  latitude: number | null;
  longitude: number | null;
  name: string;
  phone: string;
  slug: string;
  sortOrder: number;
};

export type OrderStatus =
  | 'PENDING_REVIEW'
  | 'RECEIVED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';
export type OrderType = 'PRODUCT_ORDER' | 'PRESCRIPTION_REQUEST';
export type FulfillmentMethod = 'DELIVERY' | 'PICKUP';
export type PaymentMethod =
  | 'ONLINE'
  | 'CASH_ON_DELIVERY'
  | 'CARD_ON_DELIVERY';
export type PricingStatus = 'NOT_REQUIRED' | 'PENDING_REVIEW' | 'PRICED';

export type Order = {
  id: string;
  type: OrderType;
  customerName: string;
  customerPhone: string;
  address: string;
  fulfillmentMethod: FulfillmentMethod;
  deliveryDate: string | null;
  deliveryTimeSlot: string | null;
  paymentMethod: PaymentMethod;
  pricingStatus: PricingStatus;
  confirmByCall: boolean;
  deliveryFeePiasters: number;
  notes: string | null;
  status: OrderStatus;
  items: {
    id: string;
    productId: string;
    productUnitId: string | null;
    unitLabel: string | null;
    quantity: number;
    pricePiasters: number;
    product: Product;
    productUnit: ProductUnit | null;
  }[];
  prescriptions: PrescriptionUpload[];
  createdAt: string;
  updatedAt: string;
};

type CreateOrderInput = {
  type: OrderType;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: {
    productId: string;
    productUnitId?: string;
    quantity: number;
  }[];
  prescriptionUploadIds: string[];
  checkout?: {
    fulfillmentMethod: FulfillmentMethod;
    deliveryDate?: string;
    deliveryTimeSlot?: string;
    paymentMethod: PaymentMethod;
    confirmByCall: boolean;
    deliveryFeePiasters: number;
  };
  notes?: string;
};

export type AddressInput = {
  addressName: string;
  additionalPhone?: string;
  apartment?: string;
  area: string;
  building: string;
  city: string;
  floor?: string;
  fullName: string;
  isDefault: boolean;
  landmark?: string;
  phone: string;
  street: string;
};

async function getJson<T>(path: string) {
  const response = await fetch(`${apiUrl}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed with ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;

  return payload.data;
}

async function postJson<T>(path: string, body: unknown) {
  return sendJson<T>(path, body, 'POST');
}

async function postAuthorizedJson<T>(path: string, body: unknown, token: string) {
  return sendJson<T>(path, body, 'POST', token);
}

async function putJson<T>(path: string, body: unknown) {
  return sendJson<T>(path, body, 'PUT');
}

async function sendJson<T>(
  path: string,
  body: unknown,
  method: 'POST' | 'PUT',
  token?: string,
) {
  const response = await fetch(`${apiUrl}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API request failed with ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;

  return payload.data;
}

export function signIn(input: { password: string; phone: string }) {
  return postJson<AuthSession>('/auth/signin', input);
}

export function signUp(input: { fullName: string; password: string; phone: string }) {
  return postJson<AuthSession>('/auth/signup', input);
}

export function signOut(token: string) {
  return postAuthorizedJson<{ signedOut: boolean }>('/auth/signout', {}, token);
}

export function getCategories() {
  return getJson<Category[]>('/categories');
}

export function getBrands() {
  return getJson<Brand[]>('/brands');
}

export function getAddresses() {
  return getJson<Address[]>('/addresses');
}

export function getAddress(addressId: string) {
  return getJson<Address>(`/addresses/${addressId}`);
}

export function createAddress(input: AddressInput) {
  return postJson<Address>('/addresses', input);
}

export function updateAddress(addressId: string, input: AddressInput) {
  return putJson<Address>(`/addresses/${addressId}`, input);
}

export function getBranches() {
  return getJson<Branch[]>('/branches');
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
  subcategoryId?: string;
  query?: string;
};

export function getFilteredProducts(params: GetProductsParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.categoryId) {
    searchParams.set('categoryId', params.categoryId);
  }

  if (params.subcategoryId) {
    searchParams.set('subcategoryId', params.subcategoryId);
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

export function uploadPrescription(file: { name: string; type: string; uri: string }) {
  const formData = new FormData();
  formData.append('prescription', file as unknown as Blob);

  return fetch(`${apiUrl}/uploads/prescriptions`, {
    method: 'POST',
    body: formData,
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`API request failed with ${response.status}`);
    }

    const payload = (await response.json()) as ApiResponse<PrescriptionUpload>;

    return payload.data;
  });
}

export function createOrder(input: CreateOrderInput) {
  return postJson<Order>('/orders', input);
}

export function getOrders() {
  return getJson<Order[]>('/orders');
}

export function getOrder(orderId: string) {
  return getJson<Order>(`/orders/${orderId}`);
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
