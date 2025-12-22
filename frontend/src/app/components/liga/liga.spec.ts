import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ligas } from './liga';

describe('Ligas', () => {
  let component: Ligas;
  let fixture: ComponentFixture<Ligas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ligas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ligas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
