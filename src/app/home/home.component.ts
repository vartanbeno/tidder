import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { AuthService } from '../auth.service';
import { PostService } from '../post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../models/post';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Array<any> = [];
  pages: Array<number> = []
  currentPage: number;
  isLoaded: boolean = false;
  @ViewChild('addPostButton') addPostButton: ElementRef;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private renderer: Renderer,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => this.currentPage = params.page);
    this.currentPage = (!this.currentPage) ? 1 : this.currentPage;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.countPosts();
    this.getPosts();

    this.postService.postAdded_Observable.subscribe(res => {
      this.countPosts();
      this.getPosts();
    })

    this.postService.postDelete_Observable.subscribe(res => {
      this.countPosts();
      this.getPosts();
    })
    
    /**
     * If we want to automatically update the list of posts every 10 seconds.
     */
    // setInterval(() => {
    //   this.getPosts();
    // }, 1000 * 10);
  }

  ngAfterViewInit() {
    if (this.authService.loggedIn()) {
      this.renderer.listen(this.addPostButton.nativeElement, 'click', (event) => {
        $('#addpost')
            .modal({
              transition: 'slide down',
              autofocus: false
            })
            .modal('show');
      })
    }
  }

  getPosts() {
    if (this.currentPage < 1 || !Number.isInteger(Number(this.currentPage))) {
      this.currentPage = 1;
      this.router.navigate([''], { queryParams: { page: this.currentPage } });
      return;
    }
    let pageOffset = (this.currentPage - 1).toString()
    this.postService.getPosts(pageOffset).subscribe(
      res => {
        this.posts = res;
        this.isLoaded = true;
        if (!this.posts.length && this.currentPage != 1) {
          let maxPage = this.pages[this.pages.length - 1];
          this.currentPage = (this.currentPage > maxPage) ? maxPage : 1;
          this.router.navigate([''], { queryParams: { page: this.currentPage } });
        }
      },
      err => console.log(err)
    )
  }

  countPosts() {
    this.postService.countPosts().subscribe(
      res => {
        let numberOfPages = Math.ceil(res/10);
        this.pages = Array.from(Array(numberOfPages)).map((x, i) => i + 1);
      },
      err => console.log(err)
    )
  }

  navigateToPage(pageNumber: number) {
    this.router.navigate([''], { queryParams: { page: pageNumber } })
  }

  setPostToDelete(post: Post) {
    this.postService.setPostToDelete(post);
    $('#deletepost')
        .modal({
          transition: 'vertical flip'
        })
        .modal('show');
  }

  setPostToEdit(post: Post) {
    this.postService.setPostToEdit(post);
    $('#editpost')
        .modal({
          transition: 'slide down',
          autofocus: false
        })
        .modal('show');
  }

}
