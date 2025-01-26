import { Component, EventEmitter, inject, Input, Output, ViewChild, viewChild } from '@angular/core';
import { ModalLgComponent } from '../../../bootstrap/modal-lg/modal-lg.component';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'mensagem-edit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    ModalLgComponent,
  ],
  templateUrl: './mensagem-edit-modal.component.html',
  styleUrl: './mensagem-edit-modal.component.css'
})
export class MensagemEditModalComponent {

  private readonly apiUrl = environment.apiUrl

  _mensagemId!: number;

  @Output()
  onSuccess: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onError: EventEmitter<HttpErrorResponse> = new EventEmitter<HttpErrorResponse>();

  @ViewChild(ModalLgComponent)
  modalLg!: ModalLgComponent;

  form: FormGroup

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  constructor() {
    this.form = this.fb.group({
      titulo: [''],
      conteudo: ['']
    });
  }

  @Input()
  set mensagemId(value: number) {
    this._mensagemId = value;
    if (this._mensagemId) {
      this.http.get(`${this.apiUrl}/mensagens/${value}`)
        .subscribe({
          next: (response: any) => {
            this.form.setValue({
              titulo: response.titulo,
              conteudo: response.conteudo
            });
          },
          error: (error: any) => {
            console.error('Erro ao buscar mensagem', error);
          }
        });
    }
  }

  submit() {
    this.http.put(`${this.apiUrl}/mensagens/${this._mensagemId}`, this.form.value)
      .subscribe({
        next: (response: any) => {
          this.toastr.success('Mensagem atualizada com sucesso');
          this.onSuccess.emit(response);
          this.modalLg.hide();
        },
        error: (error: HttpErrorResponse) => {
          this.onError.emit(error);
        }
      });
  }


  showModal() {
    this.modalLg.show();
  }

  hideModal($event: any) {
    this.modalLg.hide();
  }

}
