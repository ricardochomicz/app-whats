import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    DatePipe
  ],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent implements OnInit {
  @Input() empresaId!: number;

  comentarios: any[] = [];
  form: FormGroup;
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      comentario: ['']
    });
  }

  ngOnInit() {
    if (this.empresaId) {
      this.carregarComentarios();
    }
  }

  carregarComentarios() {
    this.http.get<any[]>(`${this.apiUrl}/comentarios/empresa/${this.empresaId}`)
      .subscribe({
        next: (response) => {
          this.comentarios = response;
        },
        error: (error) => {
          console.error('Erro ao carregar comentários:', error);
          this.toastr.error('Erro ao carregar comentários');
        }
      });
  }

  enviarComentario() {
    if (this.form.valid) {
      const dados = {
        empresa_id: this.empresaId,
        comentario: this.form.get('comentario')?.value
      };

      this.http.post(`${this.apiUrl}/comentarios`, dados)
        .subscribe({
          next: (response) => {
            this.toastr.success('Comentário adicionado com sucesso');
            this.comentarios.unshift(response);
            this.form.reset();
          },
          error: (error) => {
            console.error('Erro ao enviar comentário:', error);
            this.toastr.error('Erro ao enviar comentário');
          }
        });
    }
  }
}
