import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Mensagem } from '../../../../model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MensagemEditModalComponent } from '../mensagem-edit-modal/mensagem-edit-modal.component';
import { MensagemEditService } from './mensagem-edit.service';
import { MensagemCreateService } from './mensagem-create.service';
import { environment } from '../../../../../environments/environment';
import { MensagemCreateModalComponent } from '../mensagem-create-modal/mensagem-create-modal.component';

@Component({
  selector: 'app-mensagem-index',
  standalone: true,
  imports: [
    HttpClientModule,
    MensagemEditModalComponent,
    MensagemCreateModalComponent
  ],
  templateUrl: './mensagem-index.component.html',
  styleUrl: './mensagem-index.component.css'
})
export class MensagemIndexComponent implements OnInit {

  private readonly apiUrl = environment.apiUrl

  @ViewChild(MensagemCreateModalComponent)
  mensagemCreateModal!: MensagemCreateModalComponent;

  @ViewChild(MensagemEditModalComponent)
  mensagemEditModal!: MensagemEditModalComponent;

  mensagemId: number = 0;

  mensagens: Array<Mensagem> = [];

  private http = inject(HttpClient);

  constructor(
    public mensagemEditService: MensagemEditService,
    public mensagemCreateService: MensagemCreateService) {
    this.mensagemEditService.mensagemIndexComponent = this;
    this.mensagemCreateService.mensagemIndexComponent = this;
  }

  ngOnInit() {
    this.getMensagens();
  }

  getMensagens() {
    this.http.get<Array<Mensagem>>(`${this.apiUrl}/mensagens`)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.mensagens = response;
        },
        error: (error: any) => {
          console.error('Erro ao buscar mensagens', error);
        }
      });
  }


}

