import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensagemEditModalComponent } from './mensagem-edit-modal.component';

describe('MensagemEditModalComponent', () => {
  let component: MensagemEditModalComponent;
  let fixture: ComponentFixture<MensagemEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensagemEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensagemEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
