import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizedPag } from './unauthorized-pag';

describe('UnauthorizedPag', () => {
  let component: UnauthorizedPag;
  let fixture: ComponentFixture<UnauthorizedPag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthorizedPag]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnauthorizedPag);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
