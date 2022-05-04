import {CalculatorService} from './calculator.service';
import {LoggerService} from './logger.service';


describe('CalculatorService', () => {
   it('adds two numbers', () => {
     const logger = jasmine.createSpyObj('LoggerService', ['log']);
     const calculator = new CalculatorService(logger);
     const result = calculator.add(1, 1);
      expect(result).toBe(2);
      expect(logger.log).toHaveBeenCalledTimes(2);
   });

  it('subtracts two numbers', () => {
    const calculator = new CalculatorService(new LoggerService());
    const result = calculator.subtract(1, 1);
    expect(result).toBe(0, 'unexpected subtraction result');
  });
});
