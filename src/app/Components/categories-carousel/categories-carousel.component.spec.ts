import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesCarouselComponent } from './categories-carousel.component';

describe('CategoriesCarouselComponent', () => {

  let component: CategoriesCarouselComponent;
  let fixture: ComponentFixture<CategoriesCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesCarouselComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});