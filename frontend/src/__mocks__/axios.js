import { vi } from "vitest";

const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request:  { use: vi.fn() },
    response: { use: vi.fn() },
  },
};

const axios = {
  create: vi.fn(() => mockAxiosInstance),
  ...mockAxiosInstance,
};

export default axios;
