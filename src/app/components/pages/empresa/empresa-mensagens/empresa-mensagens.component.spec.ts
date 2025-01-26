import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaMensagensComponent } from './empresa-mensagens.component';

describe('EmpresaMensagensComponent', () => {
  let component: EmpresaMensagensComponent;
  let fixture: ComponentFixture<EmpresaMensagensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresaMensagensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaMensagensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
