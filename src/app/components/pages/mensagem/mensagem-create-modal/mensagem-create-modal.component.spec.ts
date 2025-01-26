import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensagemCreateModalComponent } from './mensagem-create-modal.component';

describe('MensagemCreateModalComponent', () => {
  let component: MensagemCreateModalComponent;
  let fixture: ComponentFixture<MensagemCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensagemCreateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensagemCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
