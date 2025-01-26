import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaCreateComponent } from './empresa-create.component';

describe('EmpresaCreateComponent', () => {
  let component: EmpresaCreateComponent;
  let fixture: ComponentFixture<EmpresaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresaCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
