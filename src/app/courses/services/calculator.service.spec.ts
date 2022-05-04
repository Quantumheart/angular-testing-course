import {CalculatorService} from './calculator.service';
import {LoggerService} from './logger.service';
import {TestBed} from "@angular/core/testing";


describe('CalculatorService', () => {
  let loggerSpy: any = null;
  let calculator: CalculatorService = null;


  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {provide: LoggerService, useValue: loggerSpy}
      ]
    })
    calculator = TestBed.get(CalculatorService);
  });

  it('adds two numbers', () => {
    const result = calculator.add(1, 1);
    expect(result).toBe(2);
    expect(loggerSpy.log).toHaveBeenCalledTimes(2);
  });

  it('subtracts two numbers', () => {
    const result = calculator.subtract(1, 1);
    expect(result).toBe(0, 'unexpected subtraction result');
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
