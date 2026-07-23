const fallbackApiUrl = 'http://localhost:4000';

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? fallbackApiUrl;
const fallbackProductImageUrl = '/images/brands/elkhabiry-logo.png';

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

export type InsuranceStatus = 'NOT_VERIFIED' | 'PENDING_REVIEW' | 'VERIFIED';

export type InsuranceProfile = {
  backImageUrl: string | null;
  cardholderName: string;
  createdAt: string;
  frontImageUrl: string | null;
  id: string;
  memberNumber: string;
  nationalIdBackImageUrl: string | null;
  nationalIdFrontImageUrl: string | null;
  providerName: string;
  status: InsuranceStatus;
  updatedAt: string;
  useByDefault: boolean;
};

export type InsuranceProvider = {
  createdAt: string;
  id: string;
  isActive: boolean;
  logoUrl: string | null;
  name: string;
  slug: string;
  sortOrder: number;
  updatedAt: string;
};

export type InsuranceProfileInput = {
  backImageUrl?: string;
  cardholderName: string;
  frontImageUrl?: string;
  memberNumber: string;
  nationalIdBackImageUrl?: string;
  nationalIdFrontImageUrl?: string;
  providerName: string;
  useByDefault: boolean;
};

export type UploadedInsuranceImage = {
  fileName: string;
  mimeType: string;
  originalName: string;
  sizeBytes: number;
  url: string;
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
  return getMaybeAuthorizedJson<T>(path);
}

async function getAuthorizedJson<T>(path: string, token: string) {
  return getMaybeAuthorizedJson<T>(path, token);
}

async function getMaybeAuthorizedJson<T>(path: string, token?: string) {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

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

async function putAuthorizedJson<T>(path: string, body: unknown, token: string) {
  return sendJson<T>(path, body, 'PUT', token);
}

async function deleteAuthorizedJson<T>(path: string, token: string) {
  const response = await fetch(`${apiUrl}${path}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;

  return payload.data;
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

export function getCurrentCustomer(token: string) {
  return getAuthorizedJson<Customer>('/auth/me', token);
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

export function getAddresses(token: string) {
  return getAuthorizedJson<Address[]>('/addresses', token);
}

export function getAddress(addressId: string, token: string) {
  return getAuthorizedJson<Address>(`/addresses/${addressId}`, token);
}

export function createAddress(input: AddressInput, token: string) {
  return postAuthorizedJson<Address>('/addresses', input, token);
}

export function updateAddress(addressId: string, input: AddressInput, token: string) {
  return putAuthorizedJson<Address>(`/addresses/${addressId}`, input, token);
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

export function uploadInsuranceImage(file: { name: string; type: string; uri: string }, token: string) {
  const formData = new FormData();
  formData.append('insuranceImage', file as unknown as Blob);

  return fetch(`${apiUrl}/uploads/insurance`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`API request failed with ${response.status}`);
    }

    const payload = (await response.json()) as ApiResponse<UploadedInsuranceImage>;

    return payload.data;
  });
}

export function getInsuranceProfiles(token: string) {
  return getAuthorizedJson<InsuranceProfile[]>('/insurance-profiles', token);
}

export function getInsuranceProviders() {
  return getJson<InsuranceProvider[]>('/insurance-providers');
}

export function createInsuranceProfile(input: InsuranceProfileInput, token: string) {
  return postAuthorizedJson<InsuranceProfile>('/insurance-profiles', input, token);
}

export function setDefaultInsuranceProfile(profileId: string, token: string) {
  return putAuthorizedJson<InsuranceProfile>(`/insurance-profiles/${profileId}/default`, {}, token);
}

export function deleteInsuranceProfile(profileId: string, token: string) {
  return deleteAuthorizedJson<{ deleted: boolean }>(`/insurance-profiles/${profileId}`, token);
}

export function createOrder(input: CreateOrderInput, token: string) {
  return postAuthorizedJson<Order>('/orders', input, token);
}

export function getOrders(token: string) {
  return getAuthorizedJson<Order[]>('/orders', token);
}

export function getOrder(orderId: string, token: string) {
  return getAuthorizedJson<Order>(`/orders/${orderId}`, token);
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

export function resolveProductImageUrl(imageUrl: string | null | undefined) {
  const productImageUrl = imageUrl?.startsWith('/images/categories/')
    ? fallbackProductImageUrl
    : imageUrl ?? fallbackProductImageUrl;

  return resolveImageUrl(productImageUrl);
}
