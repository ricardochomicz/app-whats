import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaEditComponent } from './empresa-edit.component';

describe('EmpresaEditComponent', () => {
  let component: EmpresaEditComponent;
  let fixture: ComponentFixture<EmpresaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresaEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
