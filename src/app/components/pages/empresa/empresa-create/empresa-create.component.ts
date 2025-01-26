import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { isCNPJ } from "brazilian-values";
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-empresa-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterLink,
    NgFor,
    NgIf
  ],
  templateUrl: './empresa-create.component.html',
  styleUrl: './empresa-create.component.css'
})
export class EmpresaCreateComponent {

  private readonly apiUrl = environment.apiUrl

  form: FormGroup

  private searchSubject = new Subject<string>();

  private http = inject(HttpClient)
  private fb = inject(FormBuilder)
  private toastr = inject(ToastrService)
  private router = inject(Router)

  constructor() {
    this.form = this.fb.group({
      cnpj: [''],
      nome: [''],
      operadora: [''],
      cep: [''],
      endereco: [''],
      cidade: [''],
      contato: [''],
      telefones: this.fb.array([this.fb.control('')])
    })
  }

  get contatos() {
    return this.form.get('contatos') as FormArray
  }

  addContato() {
    this.contatos.push(this.fb.group({
      empresa_id: [this.form.get('id')?.value],
      nome: [''],
      telefone: [''],
    }))
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

  getEmpresa(cnpj: KeyboardEvent) {
    const input = cnpj.target as HTMLInputElement;
    const doc = input.value.replace(/[^\d]+/g, "");
    if (doc.length === 14) {
      if (!isCNPJ(doc)) {
        this.toastr.error('CNPJ inválido');
        return;
      }

      // Primeiro verifica se o CNPJ já existe
      this.http.get<{ exists: boolean, empresa: any }>(`${this.apiUrl}/empresas/${doc}/cnpj`)
        .subscribe({
          next: (response) => {
            if (response.exists) {
              this.toastr.error('Empresa já cadastrada');
              this.form?.patchValue({ cnpj: '' });
            } else {
              // Se não existe, consulta na Receita através do backend
              this.http.get<{ data: any }>(`${this.apiUrl}/empresas/${doc}/consulta`)
                .subscribe({
                  next: (responseReceita) => {
                    if (responseReceita.data) {
                      this.populateForm(responseReceita.data);
                    } else {
                      this.toastr.error('CNPJ não encontrado');
                    }
                  },
                  error: (error) => {
                    this.toastr.error('Erro ao consultar CNPJ');
                    console.error('Erro:', error);
                  }
                });
            }
          },
          error: (error) => {
            this.toastr.error('Erro ao verificar CNPJ');
            console.error('Erro:', error);
          }
        });
    }
  }

  private populateForm(response: any) {
    this.form?.patchValue({
      nome: response.nome,
      cep: response.cep,
      endereco: response.logradouro,
      cidade: response.municipio,
    });
  }

  onKeyup(cnpj: string) {
    this.searchSubject.next(cnpj);
  }

  submit() {
    if (this.form.valid) {
      this.http.post(`${this.apiUrl}/empresas`, this.form.value)
        .subscribe({
          next: (response: any) => {
            this.toastr.success(response.message);
            this.router.navigate(['empresas']);
          },
          error: (error) => {
            this.toastr.error('Erro ao cadastrar empresa');
            console.error('Erro:', error);
          }
        });
    } else {
      this.toastr.error('Por favor, preencha todos os campos obrigatórios');
    }
  }

}
