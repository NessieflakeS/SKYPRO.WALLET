import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validateAmount, 
  validateDescription 
} from '../utils/validation';

describe('Validation Functions', () => {
  describe('validateEmail', () => {
    test('validates correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    test('rejects invalid email without @', () => {
      expect(validateEmail('testexample.com')).toBe(false);
    });

    test('rejects invalid email without domain', () => {
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('validates password with 6+ characters', () => {
      expect(validatePassword('123456')).toBe(true);
    });

    test('rejects password with less than 6 characters', () => {
      expect(validatePassword('12345')).toBe(false);
    });
  });

  describe('validateName', () => {
    test('validates name with 2+ characters', () => {
      expect(validateName('John')).toBe(true);
    });

    test('rejects name with less than 2 characters', () => {
      expect(validateName('J')).toBe(false);
    });

    test('rejects empty name', () => {
      expect(validateName('')).toBe(false);
    });
  });

  describe('validateAmount', () => {
    test('validates positive amount', () => {
      expect(validateAmount('100')).toBe(true);
    });

    test('rejects zero amount', () => {
      expect(validateAmount('0')).toBe(false);
    });

    test('rejects negative amount', () => {
      expect(validateAmount('-100')).toBe(false);
    });

    test('rejects amount over 1,000,000', () => {
      expect(validateAmount('1000001')).toBe(false);
    });
  });

  describe('validateDescription', () => {
    test('validates non-empty description', () => {
      expect(validateDescription('Test description')).toBe(true);
    });

    test('rejects empty description', () => {
      expect(validateDescription('')).toBe(false);
    });

    test('rejects whitespace-only description', () => {
      expect(validateDescription('   ')).toBe(false);
    });
  });
});