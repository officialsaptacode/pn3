import { describe, it, expect } from 'vitest';
import axios from 'axios';

describe('API Client', () => {
    it('should create axios instance with baseURL', () => {
        const api = axios.create({
            baseURL: 'http://localhost:5000/api',
            withCredentials: true,
        });
        expect(api.defaults.baseURL).toBe('http://localhost:5000/api');
        expect(api.defaults.withCredentials).toBe(true);
    });
});
