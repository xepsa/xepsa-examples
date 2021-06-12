(module
  ;; for (i = 0; i < 20; i++) {}; return i;
  (func $forLoop (result i32)
      (local $x i32)
      (local $res i32)

      (set_local $x (i32.const 0))
      (set_local $res (i32.const 0))

      (block
        (loop
         (set_local $x (call $increment (get_local $x)))
         (set_local $res (i32.add (get_local $res) (get_local $x)))
         (br_if 1 (i32.eq (get_local $x) (i32.const 20)))
         (br 0)
      )
    )

    (get_local $res)
  )

  (func $increment (param $x i32) (result i32)
     (i32.add (get_local $x) (i32.const 1))
  )

  (export "forLoop" (func $forLoop))
)