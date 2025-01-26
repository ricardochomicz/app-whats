import { Component, ElementRef, EventEmitter, inject, Output } from '@angular/core';

declare const $: any;

@Component({
  selector: 'modal-lg',
  standalone: true,
  imports: [],
  templateUrl: './modal-lg.component.html',
  styleUrl: './modal-lg.component.css'
})
export class ModalLgComponent {

  private element = inject(ElementRef);

  @Output()
  onHide: EventEmitter<Event> = new EventEmitter<Event>();

  constructor() {
    const jqueryElement = this.getJQueryElement();

    jqueryElement.find('[modal-title]').addClass('modal-title');
    jqueryElement.find('[modal-body]').addClass('modal-body');
    jqueryElement.find('[modal-footer]').addClass('modal-footer');

    jqueryElement.on('hidden.bs.modal', ($event: any) => {
      console.log($event);
      this.onHide.emit($event);
    });
  }


  show() {
    this.getJQueryElement().modal('show');
  }

  hide() {
    this.getJQueryElement().modal('hide');
  }


  private getJQueryElement() {
    const nativeElement = this.element.nativeElement;
    return $(nativeElement.firstChild);

  }

}
