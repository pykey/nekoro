import { sameAsValidator } from './sameAs.validator';

const makeControl = (value: string): any => {
  return {
    value,
    root: {
      get(otherValue: string): any {
        if (!otherValue) { return null; }

        return {
          value: otherValue
        } as any;
      }
    }
  } as any;
};

describe('SameAsValidator', () => {
  it('should return null if both values are equal', () => {
    const value = 'validValue';
    const control = makeControl(value);

    expect(sameAsValidator(value)(control)).toBeNull();
  });

  it('should return null if target is not found', () => {
    const control = makeControl('validValue');

    expect(sameAsValidator(null)(control)).toBeNull();
  });

  it('should not return null if both values are not equal', () => {
    const control = makeControl('notValidValue');

    expect(sameAsValidator('anotherNotValidValue')(control)).not.toBeNull();
  });
});
