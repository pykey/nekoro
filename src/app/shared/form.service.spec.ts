import { TestBed, inject } from '@angular/core/testing';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { FormService } from './form.service';

const noValFields = {
  test: ''
};

const oneValFields = {
  test: ['', Validators.required]
};

const twoValFields = {
  test: ['', [
    Validators.required,
    Validators.minLength(5)
  ]]
};

describe('FormService', () => {
  let formBuilder: FormBuilder;
  let formService: FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        FormService
      ]
    });

    inject([FormBuilder, FormService], (fBuilder: FormBuilder, fService: FormService) => {
      formBuilder = fBuilder;
      formService = fService;
    })();
  });

  it('should be defined', () => {
    expect(formService).toBeDefined();
  });

  describe('Group', () => {
    it('should process fields and return a Form Group', () => {
      const formGroup = formService.group(oneValFields);

      expect(formGroup instanceof FormGroup).toBe(true);
      expect(formService.form instanceof FormGroup).toBe(true);
      expect(formService.formErrors).toEqual({ test: '' });
      expect(formService.valueChangesSubscription instanceof Subscription).toBe(true);
    });
  });

  describe('RemoveSubscriptions', () => {
    it('should unsubscribe value changes', () => {
      formService.group(noValFields);

      spyOn(formService.valueChangesSubscription, 'unsubscribe');

      formService.removeSubscriptions();

      expect(formService.valueChangesSubscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('ParseFields', () => {
    it('should do nothing if fields without validations are passed', () => {
      formService.group(noValFields);

      expect(formService.formErrors).toEqual({});
    });

    it('should parse validations from fields with one validation', () => {
      formService.group(oneValFields);

      expect(formService.formErrors).toEqual({ test: '' });
    });

    it('should parse validations from fields with multiple validations', () => {
      formService.group(twoValFields);

      expect(formService.formErrors).toEqual({ test: '' });
    });
  });

  describe('OnValueChanges', () => {
    const minLengthMessage = 'test min length error';
    const validationMessages = { test: { minlength: minLengthMessage } };

    it('should do nothing if no validation messages are defined', () => {
      formService.group(twoValFields);

      expect(formService.formErrors['test']).toBe('');
    });

    it('should store errors if some field is invalid', () => {
      formService.validationMessages = validationMessages;
      formService.group(twoValFields);

      formService.form.get('test').markAsDirty();
      formService.form.setValue({ test: 'sh' });

      expect(formService.formErrors['test']).toBe(minLengthMessage);
    });

    it('should define error as empty string if no message is defined', () => {
      formService.validationMessages = validationMessages;
      formService.group(twoValFields);

      formService.form.get('test').markAsDirty();
      formService.form.setValue({ test: ''});

      expect(formService.formErrors['test']).toBe('');
    });
  });
});
