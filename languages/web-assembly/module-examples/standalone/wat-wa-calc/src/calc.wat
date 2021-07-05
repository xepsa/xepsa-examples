(module
  (func $add (param $lhs i32) (param $rhs i32) (result i32)
     (i32.add
       (get_local $lhs)
       (get_local $rhs)
     )
  )
  (export "add" (func $add))

  (func $sub (param $lhs i32) (param $rhs i32) (result i32)
     (i32.sub
       (get_local $lhs)
       (get_local $rhs)
     )
  )
  (export "sub" (func $sub))

  (func $mul (param $lhs i32) (param $rhs i32) (result i32)
     (i32.mul
       (get_local $lhs)
       (get_local $rhs)
     )
  )
  (export "mul" (func $mul))

  (func $div (param $lhs i32) (param $rhs i32) (result i32)
     (i32.div_s
       (get_local $lhs)
       (get_local $rhs)
     )
  )
  (export "div" (func $div))
)