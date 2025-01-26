import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensagemIndexComponent } from './mensagem-index.component';

describe('MensagemIndexComponent', () => {
  let component: MensagemIndexComponent;
  let fixture: ComponentFixture<MensagemIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensagemIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensagemIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
