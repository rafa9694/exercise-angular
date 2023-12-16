import { NgModule } from "@angular/core";

import { AlertComponent } from "./alert/alert.component";
import { LoadingGearComponent } from "./loading-gear/loading-gear.component";
import { DropdownDirective } from "./dropdown.directive";
import { CommonModule } from "@angular/common";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";

@NgModule({
  declarations: [
    AlertComponent,
    LoadingGearComponent,
    PlaceholderDirective,
    DropdownDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    LoadingGearComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule
  ]
})
export class SharedModule {

}