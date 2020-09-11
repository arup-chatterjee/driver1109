import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TermsconditionsPage } from './termsconditions.page';

describe('TermsconditionsPage', () => {
  let component: TermsconditionsPage;
  let fixture: ComponentFixture<TermsconditionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsconditionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TermsconditionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
