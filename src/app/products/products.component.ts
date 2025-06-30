import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RupiahPipe } from '../pipe/rupiah.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AuthService } from '../services/auth.service';


@Component({
  standalone: true,
  imports: [
    HttpClientModule,
    RupiahPipe,
        CommonModule,
        MatTableModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        RouterModule,
        MatPaginatorModule
  ],
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  products: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  searchText: string = '';
  constructor(
    private productService: ProductsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private authService: AuthService 
  ) {}

  ngOnInit() {
  this.initData();
   }
  initData(){
    try {
      this.productService.getProducts().subscribe(data => {
        this.dataSource.data = data;
        this.products = data;
        if (this.products.length === 0) {
          this.toastr.info('Tidak ada produk ditemukan', 'Info');
        }
      this.dataSource.paginator = this.paginator;
      }, error => {
        console.error('Error fetching products:', error);
        this.toastr.error('Gagal memuat data produk', 'Kesalahan '+error.statusText);
      });
    } catch (thisError) {
      console.error('Error initializing data:', thisError);
      this.toastr.error('Gagal memuat data produk', 'Kesalahan');
    }
    }

      onUpdate(product: any) {
    console.log('Update product:', product);
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '300px',
      data: { ...product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.updateProduct(product.id, result).subscribe(updated => {
          this.products = this.products.map(p => p.id === updated.id ? updated : p);
          // this.snackBar.open('Produk berhasil diupdate!', 'Tutup', { duration: 2000 });
          this.toastr.success('Berhasil!', 'Sukses');
        });
      }
    });
  }

  onDelete(product: any) {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      this.productService.deleteProduct(product.id).subscribe(() => {
        this.products = this.products.filter(p => p.id !== product.id);
        this.snackBar.open('Produk berhasil dihapus!', 'Tutup', { duration: 2000 });
            }, error => {
        this.snackBar.open('Gagal menghapus produk!', 'Tutup', { duration: 2000 });
      });
    }
  }

  onAdd() {
    this.dialog.open(ProductDialogComponent, { width: '300px' })
      .afterClosed().subscribe(result => {
        if (result) {
          this.productService.addProduct(result).subscribe(saved => {
            this.products = [...this.products, saved];
            this.snackBar.open('Produk berhasil disimpan!', 'Tutup', { duration: 2000 });
          });
        }
      });
  }

  get filteredProducts() {
    if (!this.searchText) return this.products;
    const lower = this.searchText.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      (p.price && p.price.toString().includes(lower))
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onLogout() {
    this.authService.logout();
  }
}
