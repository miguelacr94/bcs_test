import { Test, TestingModule } from '@nestjs/testing';
import { OfferCoreService } from './offer-core.service';

describe('OfferCoreService', () => {
  let service: OfferCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfferCoreService],
    }).compile();

    service = module.get<OfferCoreService>(OfferCoreService);

    // Evitar demoras en tests por el setTimeout de 1 segundo
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return error when random < 0.33', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.2);

    const promise = service.simulateOffer('app-1', 'client-1', 10000, 12);
    jest.runAllTimers();

    await expect(promise).rejects.toThrow(
      'Error técnico temporal conectando con el Core Bancario de Ofertas. Intente nuevamente.',
    );
  });

  it('should return partial offer when 0.33 <= random < 0.66', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const promise = service.simulateOffer('app-1', 'client-1', 10000, 24);
    jest.runAllTimers();

    const result = await promise;
    expect(result.success).toBe(false);
    expect(result.offerDetails?.approvedAmount).toBe(7000); // 70% of 10000
    expect(result.offerDetails?.interestRate).toBe(1.85);
  });

  it('should return full offer when random >= 0.66', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.8);

    const promise = service.simulateOffer('app-1', 'client-1', 10000, 24);
    jest.runAllTimers();

    const result = await promise;
    expect(result.success).toBe(true);
    expect(result.offerDetails?.approvedAmount).toBe(10000);
    expect(result.offerDetails?.interestRate).toBe(1.45);
  });
});
