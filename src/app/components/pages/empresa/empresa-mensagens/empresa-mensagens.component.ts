import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { ComentariosComponent } from '../../comentario/comentarios/comentarios.component';

interface Mensagem {
  id: number;
  titulo: string;
  conteudo: string;
}

@Component({
  selector: 'app-empresa-mensagens',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    RouterLink,
    HttpClientModule,
    ComentariosComponent,
  ],
  templateUrl: './empresa-mensagens.component.html'
})
export class EmpresaMensagensComponent implements OnInit {

  private readonly apiUrl = environment.apiUrl

  empresa: any;
  mensagens: Mensagem[] = [];
  mensagensSelecionadas: { [key: string]: number } = {};
  editandoTelefone: { [key: string]: boolean } = {};
  telefoneEditado: { [key: string]: string } = {};
  statusTelefone: { [key: string]: string } = {};
  empresaId: number;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  constructor() {
    this.empresaId = Number(this.route.snapshot.params['id']);
  }

  ngOnInit() {
    this.carregarEmpresa(this.empresaId.toString());
    this.carregarMensagens();
  }

  carregarEmpresa(id: string) {
    this.http.get<any>(`${this.apiUrl}/empresas/${id}`)
      .subscribe({
        next: (response) => {
          this.empresa = response;
          // Inicializa o status para cada telefone
          this.empresa.telefones.forEach((telefone: string) => {
            this.statusTelefone[telefone] = response.status_telefones?.[telefone] || 'pendente';
          });
        },
        error: (error) => {
          this.toastr.error('Erro ao carregar dados da empresa');
          console.error('Erro:', error);
        }
      });
  }

  carregarMensagens() {
    this.http.get<Mensagem[]>(`${this.apiUrl}/mensagens`)
      .subscribe({
        next: (response) => {
          this.mensagens = response;
        },
        error: (error) => {
          this.toastr.error('Erro ao carregar mensagens');
          console.error('Erro:', error);
        }
      });
  }

  getUltimoEnvio(telefone: string): string {
    const ultimoEnvio = this.empresa?.ultimosEnvios?.[telefone];
    if (!ultimoEnvio || !ultimoEnvio.data) {
      return 'Nenhum envio';
    }

    const data = new Date(ultimoEnvio.data);
    return `${data.toLocaleDateString()} ${data.toLocaleTimeString()} - ${ultimoEnvio.mensagem}`;
  }

  enviarMensagem(telefone: string) {
    const mensagemId = this.mensagensSelecionadas[telefone];
    if (!mensagemId) return;

    // Primeiro busca o conteúdo da mensagem selecionada
    const mensagem = this.mensagens.find(m => m.id === Number(mensagemId));
    if (!mensagem) {
      this.toastr.error('Mensagem não encontrada');
      return;
    }

    // Formata o telefone (remove caracteres não numéricos)
    const phoneNumber = telefone.replace(/\D/g, '');

    // Adiciona o nome do contato ao texto da mensagem
    const textoComContato = `Olá ${this.empresa.contato} tudo bem?\n${mensagem.conteudo}`;

    // Codifica a mensagem para URL
    const text = encodeURIComponent(textoComContato);

    // Constrói o link do WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=55${phoneNumber}&text=${text}`;

    // Abre o link em uma nova janela
    window.open(whatsappUrl, '_blank');

    // Registra o envio no backend
    const dados = {
      telefone: telefone,
      mensagemId: mensagemId
    };

    this.http.post(`${this.apiUrl}/mensagens/enviar`, dados)
      .subscribe({
        next: (response: any) => {
          this.toastr.success('Mensagem enviada com sucesso');

          // Atualiza o último envio localmente
          if (!this.empresa.ultimosEnvios) {
            this.empresa.ultimosEnvios = {};
          }

          this.empresa.ultimosEnvios[telefone] = {
            data: new Date().toISOString(),
            status: 'enviado',
            mensagem: mensagem.titulo
          };

          // Atualiza o status do telefone
          this.statusTelefone[telefone] = 'enviado';

          // Mantém a mensagem selecionada
          this.mensagensSelecionadas[telefone] = mensagemId;
        },
        error: (error) => {
          this.toastr.error('Erro ao registrar envio da mensagem');
          console.error('Erro:', error);
        }
      });
  }

  getMensagemPreview(mensagemId: number): string {
    const mensagem = this.mensagens.find(m => m.id === Number(mensagemId));
    if (!mensagem) return '';

    // Retorna os primeiros 50 caracteres da mensagem
    return mensagem.conteudo.length > 50
      ? mensagem.conteudo.substring(0, 50) + '...'
      : mensagem.conteudo;
  }

  onMensagemSelecionada(event: any, telefone: string) {
    // Limpa o preview se nenhuma mensagem selecionada
    if (!event.target.value) {
      this.mensagensSelecionadas[telefone] = 0;
    }
  }

  iniciarEdicaoTelefone(telefone: string) {
    this.editandoTelefone[telefone] = true;
    this.telefoneEditado[telefone] = telefone;
  }

  cancelarEdicaoTelefone(telefone: string) {
    this.editandoTelefone[telefone] = false;
    this.telefoneEditado[telefone] = '';
  }

  salvarTelefone(telefoneAntigo: string) {
    const novoTelefone = this.telefoneEditado[telefoneAntigo];

    if (!novoTelefone) {
      this.toastr.error('Telefone não pode ficar em branco');
      return;
    }

    // Remove caracteres não numéricos para validação
    const numeroLimpo = novoTelefone.replace(/\D/g, '');
    if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
      this.toastr.error('Número de telefone inválido');
      return;
    }

    this.http.put(`${this.apiUrl}/telefones/${telefoneAntigo}`, {
      numero: novoTelefone
    }).subscribe({
      next: (response: any) => {
        this.toastr.success('Telefone atualizado com sucesso');
        this.editandoTelefone[telefoneAntigo] = false;

        // Atualiza o estado local antes de recarregar
        const index = this.empresa.telefones.indexOf(telefoneAntigo);
        if (index !== -1) {
          this.empresa.telefones[index] = novoTelefone;

          // Transfere o status do telefone antigo para o novo
          if (this.statusTelefone[telefoneAntigo]) {
            this.statusTelefone[novoTelefone] = this.statusTelefone[telefoneAntigo];
            delete this.statusTelefone[telefoneAntigo];
          }

          // Transfere a mensagem selecionada se houver
          if (this.mensagensSelecionadas[telefoneAntigo]) {
            this.mensagensSelecionadas[novoTelefone] = this.mensagensSelecionadas[telefoneAntigo];
            delete this.mensagensSelecionadas[telefoneAntigo];
          }
        }

        // Recarrega os dados atualizados
        this.carregarEmpresa(this.empresaId.toString());
      },
      error: (error) => {
        this.toastr.error('Erro ao atualizar telefone');
        console.error('Erro:', error);
      }
    });
  }

  atualizarStatus(telefone: string) {
    const status = this.statusTelefone[telefone];

    this.http.put(`${this.apiUrl}/telefones/${telefone}/status`, {
      status: status
    }).subscribe({
      next: () => {
        this.toastr.success('Status atualizado com sucesso');
      },
      error: (error) => {
        this.toastr.error('Erro ao atualizar status');
        console.error('Erro:', error);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'enviado': return 'primary';
      case 'recebido': return 'info';
      case 'lido': return 'success';
      default: return 'secondary';
    }
  }
}
