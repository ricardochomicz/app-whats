import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from '../../../../model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-empresa-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgFor,
    NgIf,
    RouterLink,
  ],
  templateUrl: './empresa-edit.component.html',
  styleUrl: './empresa-edit.component.css'
})
export class EmpresaEditComponent implements OnInit {

  private readonly apiUrl = environment.apiUrl
  form: FormGroup;
  empresaId: string;

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  constructor() {
    this.empresaId = this.route.snapshot.params['id'];
    this.form = this.fb.group({
      cnpj: [''],
      nome: [''],
      operadora: [''],
      cep: [''],
      endereco: [''],
      cidade: [''],
      contato: [''],
      telefones: this.fb.array([])
    });
  }

  ngOnInit() {
    this.carregarEmpresa();
  }

  get telefones() {
    return this.form.get('telefones') as FormArray;
  }

  adicionarTelefone() {
    this.telefones.push(this.fb.control(''));
  }

  removerTelefone(index: number) {
    this.telefones.removeAt(index);
  }

  carregarEmpresa() {
    this.http.get<any>(`${this.apiUrl}/empresas/${this.empresaId}`)
      .subscribe({
        next: (empresa) => {

          // Limpa o FormArray de telefones
          while (this.telefones.length) {
            this.telefones.removeAt(0);
          }

          // Adiciona os telefones existentes
          if (empresa.telefones && empresa.telefones.length > 0) {
            console.log('Telefones encontrados:', empresa.telefones);
            empresa.telefones.forEach((telefone: string) => {
              this.telefones.push(this.fb.control(telefone));
            });
          } else {
            console.log('Nenhum telefone encontrado');
            this.telefones.push(this.fb.control(''));
          }

          // Atualiza o formulário
          this.form.patchValue({
            cnpj: empresa.cnpj,
            nome: empresa.nome,
            operadora: empresa.operadora,
            cep: empresa.cep,
            endereco: empresa.endereco,
            cidade: empresa.cidade,
            contato: empresa.contato
          });

          console.log('Formulário atualizado:', this.form.value);
        },
        error: (error) => {
          this.toastr.error('Erro ao carregar empresa');
          console.error('Erro detalhado:', error);
        }
      });
  }

  submit() {
    this.http.put(`${this.apiUrl}/empresas/${this.empresaId}`, this.form.value)
      .subscribe({
        next: (response: any) => {
          this.toastr.success('Empresa atualizada com sucesso');
          this.router.navigate(['/empresas']);
        },
        error: (error) => {
          this.toastr.error('Erro ao atualizar empresa');
          console.error('Erro:', error);
        }
      });
  }
}
