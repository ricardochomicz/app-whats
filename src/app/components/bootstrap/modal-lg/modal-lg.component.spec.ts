import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLgComponent } from './modal-lg.component';

describe('ModalLgComponent', () => {
  let component: ModalLgComponent;
  let fixture: ComponentFixture<ModalLgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalLgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalLgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
