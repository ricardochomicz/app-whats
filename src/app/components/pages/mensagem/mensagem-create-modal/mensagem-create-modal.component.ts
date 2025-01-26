import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { ModalLgComponent } from '../../../bootstrap/modal-lg/modal-lg.component';

@Component({
  selector: 'mensagem-create-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    ModalLgComponent
  ],
  templateUrl: './mensagem-create-modal.component.html',
  styleUrl: './mensagem-create-modal.component.css'
})
export class MensagemCreateModalComponent {

  private readonly apiUrl = environment.apiUrl;

  @Output()
  onSuccess: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onError: EventEmitter<HttpErrorResponse> = new EventEmitter<HttpErrorResponse>();

  @ViewChild(ModalLgComponent)
  modalLg!: ModalLgComponent;

  formCreate: FormGroup;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);

  constructor() {
    this.formCreate = this.fb.group({
      titulo: [''],
      conteudo: ['']
    });
  }

  submit() {
    if (this.formCreate.valid) {
      this.http.post(`${this.apiUrl}/mensagens`, this.formCreate.value)
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.toastr.success('Mensagem cadastrada com sucesso');
            this.onSuccess.emit(response);
            this.modalLg.hide();
          },
          error: (error) => {
            this.toastr.error('Erro ao cadastrar mensagem');
            console.error('Erro:', error);
            this.onError.emit(error);
          }
        });
    }
  }

  showModal() {
    this.modalLg.show();
  }

  hideModal($event: any) {
    this.modalLg.hide();
  }


}
