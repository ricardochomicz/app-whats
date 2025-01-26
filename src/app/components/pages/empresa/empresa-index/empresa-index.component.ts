import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Empresa } from '../../../../model';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-empresa-index',
  standalone: true,
  imports: [
    RouterLink,
    HttpClientModule,
    NgFor,
    NgIf,
    DecimalPipe,
    FormsModule
  ],
  templateUrl: './empresa-index.component.html',
  styleUrl: './empresa-index.component.css'
})
export class EmpresaIndexComponent {

  private readonly apiUrl = environment.apiUrl

  empresas: Array<Empresa> = []
  currentPage: number = 1
  totalPages: number = 0
  itemsPerPage: number = 10
  totalItems: number = 0

  filtros = {
    busca: '',
    mensagem: '',
    dataInicio: '',
    dataFim: ''
  };

  private filtroTimeout: any;

  private http = inject(HttpClient)
  private toastr = inject(ToastrService)


  constructor() {
    this.getEmpresas()
  }

  getEmpresas(page: number = 1) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', this.itemsPerPage.toString());

    if (this.filtros.busca) params = params.set('busca', this.filtros.busca);
    if (this.filtros.mensagem) params = params.set('mensagem', this.filtros.mensagem);
    if (this.filtros.dataInicio) params = params.set('dataInicio', this.filtros.dataInicio);
    if (this.filtros.dataFim) params = params.set('dataFim', this.filtros.dataFim);

    this.http.get<any>(`${this.apiUrl}/empresas`, { params })
      .subscribe({
        next: (response) => {
          this.empresas = response.data
          this.totalItems = response.total
          this.totalPages = response.totalPages
          this.currentPage = response.currentPage
        }
      })
  }

  onPageChange(page: number) {
    this.getEmpresas(page)
  }

  onFiltroChange() {
    // Debounce para evitar muitas requisições
    if (this.filtroTimeout) {
      clearTimeout(this.filtroTimeout);
    }
    this.filtroTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.getEmpresas();
    }, 300);
  }

  get pages(): number[] {
    const pages = []
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  formatarData(data: string): string {
    if (!data) return ''
    const date = new Date(data)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  protected Math = Math;

  excluirEmpresa(id: number) {
    if (confirm('Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.')) {
      this.http.delete(`${this.apiUrl}/empresas/${id}`).subscribe({
        next: () => {
          // Atualiza a lista de empresas
          this.getEmpresas();
          // Mostra mensagem de sucesso
          this.toastr.success('Empresa excluída com sucesso');
        },
        error: (erro) => {
          console.error('Erro ao excluir empresa:', erro);
          this.toastr.error('Erro ao excluir empresa');
        }
      });
    }
  }

}
