import {TestBed} from "@angular/core/testing";
import {CoursesService} from "./courses.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {COURSES, findLessonsForCourse} from "../../../../server/db-data";
import {Course} from "../model/course";
import {HttpErrorResponse} from "@angular/common/http";


describe('CoursesService', () => {
  let httpTestingController: HttpTestingController = null;
  let coursesService: CoursesService = null;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService,
      ]
    })
    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('retrieves all courses', () => {
    coursesService.findAllCourses()
      .subscribe((courses) => {
      expect(courses).toBeTruthy('No Courses returned.');
      expect(courses.length).toBe(12, 'incorrect number of courses');
      const course = courses.find(crs => crs.id === 12);
      expect(course.titles.description).toBe('Angular Testing Course');
    });
    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toEqual('GET');
    req.flush({payload: Object.values(COURSES)})
  });

  it('retrieves all courses', () => {
    coursesService.findCourseById(12)
      .subscribe((courses) => {
        expect(courses).toBeTruthy();
        expect(courses.id).toBe(12);
      });
    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('GET');
    req.flush(COURSES[12])
  });

  it ('saves course data', () => {
    const changes: Partial<Course>= {titles: {description: 'Testing Course'}};
    coursesService.saveCourse(12, {titles: {description: 'Testing Course'}})
      .subscribe((course) => {
      expect(course.id).toBe(12);
      });
    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description).toBe(changes.titles.description);
    req.flush({
      ... COURSES[12],
      ... changes
    })
  })

  it('gives an error', () => {
    const changes: Partial<Course>= {titles: {description: 'Testing Course'}};

    coursesService.saveCourse(12, changes)
      .subscribe(
        {next: () => {
          fail("save should've failed")},
          error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }});
    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    req.flush('Save failed', {status: 500, statusText: 'Save Failed'});
  })

  it('finds a list of lessons', () => {
    coursesService.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();

      expect(lessons.length).toBe(3);
    })

    const req = httpTestingController.expectOne(req => req.url == '/api/lessons');

    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('courseId')).toEqual("12");
    expect(req.request.params.get('filter')).toEqual("");
    expect(req.request.params.get('sortOrder')).toEqual("asc");
    expect(req.request.params.get('pageNumber')).toEqual("0");
    expect(req.request.params.get('pageSize')).toEqual("3");

    req.flush({payload: findLessonsForCourse(12).slice(0,3)})

  })


  afterEach(() => {
    httpTestingController.verify();
  })
});
