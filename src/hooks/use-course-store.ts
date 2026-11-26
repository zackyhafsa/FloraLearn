import * as React from 'react'

import {
  COURSES_CHANGE_EVENT,
  PROGRESS_CHANGE_EVENT,
  getCourseById,
  getCourseProgress,
  getCourses,
  getPublishedCourses,
  getStudentProgress,
  type DemoCourse,
  type StudentCourseProgress,
} from '@/lib/course-store'

/** Menyinkronkan daftar seluruh course (panel guru) dengan perubahan localStorage. */
export function useCourses(): DemoCourse[] {
  const [courses, setCourses] = React.useState<DemoCourse[]>(() => getCourses())

  React.useEffect(() => {
    const sync = () => setCourses(getCourses())
    sync()
    window.addEventListener(COURSES_CHANGE_EVENT, sync)
    return () => window.removeEventListener(COURSES_CHANGE_EVENT, sync)
  }, [])

  return courses
}

/** Menyinkronkan daftar course berstatus Terbit (panel siswa). */
export function usePublishedCourses(): DemoCourse[] {
  const [courses, setCourses] = React.useState<DemoCourse[]>(() => getPublishedCourses())

  React.useEffect(() => {
    const sync = () => setCourses(getPublishedCourses())
    sync()
    window.addEventListener(COURSES_CHANGE_EVENT, sync)
    return () => window.removeEventListener(COURSES_CHANGE_EVENT, sync)
  }, [])

  return courses
}

/** Menyinkronkan satu course berdasarkan ID. */
export function useCourse(courseId: string): DemoCourse | undefined {
  const [course, setCourse] = React.useState<DemoCourse | undefined>(() => getCourseById(courseId))

  React.useEffect(() => {
    const sync = () => setCourse(getCourseById(courseId))
    sync()
    window.addEventListener(COURSES_CHANGE_EVENT, sync)
    return () => window.removeEventListener(COURSES_CHANGE_EVENT, sync)
  }, [courseId])

  return course
}

/** Menyinkronkan seluruh progress belajar & quiz siswa. */
export function useStudentProgress(studentId: string): Record<string, StudentCourseProgress> {
  const [progress, setProgress] = React.useState(() => getStudentProgress(studentId))

  React.useEffect(() => {
    const sync = () => setProgress(getStudentProgress(studentId))
    sync()
    window.addEventListener(PROGRESS_CHANGE_EVENT, sync)
    return () => window.removeEventListener(PROGRESS_CHANGE_EVENT, sync)
  }, [studentId])

  return progress
}

/** Menyinkronkan progress belajar & quiz siswa untuk satu course. */
export function useCourseProgress(studentId: string, courseId: string): StudentCourseProgress {
  const [progress, setProgress] = React.useState(() => getCourseProgress(studentId, courseId))

  React.useEffect(() => {
    const sync = () => setProgress(getCourseProgress(studentId, courseId))
    sync()
    window.addEventListener(PROGRESS_CHANGE_EVENT, sync)
    return () => window.removeEventListener(PROGRESS_CHANGE_EVENT, sync)
  }, [studentId, courseId])

  return progress
}
