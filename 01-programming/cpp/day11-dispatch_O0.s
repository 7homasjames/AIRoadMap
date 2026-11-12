	.file	"day11-dispatch.cpp"
	.intel_syntax noprefix
	.text
	.section	.text$_ZN4Base9calculateEv,"x"
	.linkonce discard
	.align 2
	.globl	"_ZN4Base9calculateEv"
	.def	"_ZN4Base9calculateEv";	.scl	2;	.type	32;	.endef
	.seh_proc	"_ZN4Base9calculateEv"
"_ZN4Base9calculateEv":
.LFB0:
	push	rbp
	.seh_pushreg	rbp
	mov	rbp, rsp
	.seh_setframe	rbp, 0
	.seh_endprologue
	mov	QWORD PTR 16[rbp], rcx
	mov	eax, 10
	pop	rbp
	ret
	.seh_endproc
	.section	.text$_ZN7Derived9calculateEv,"x"
	.linkonce discard
	.align 2
	.globl	"_ZN7Derived9calculateEv"
	.def	"_ZN7Derived9calculateEv";	.scl	2;	.type	32;	.endef
	.seh_proc	"_ZN7Derived9calculateEv"
"_ZN7Derived9calculateEv":
.LFB1:
	push	rbp
	.seh_pushreg	rbp
	mov	rbp, rsp
	.seh_setframe	rbp, 0
	.seh_endprologue
	mov	QWORD PTR 16[rbp], rcx
	mov	eax, 20
	pop	rbp
	ret
	.seh_endproc
	.text
	.globl	"_Z12callFunctionP4Base"
	.def	"_Z12callFunctionP4Base";	.scl	2;	.type	32;	.endef
	.seh_proc	"_Z12callFunctionP4Base"
"_Z12callFunctionP4Base":
.LFB2:
	push	rbp
	.seh_pushreg	rbp
	mov	rbp, rsp
	.seh_setframe	rbp, 0
	sub	rsp, 32
	.seh_stackalloc	32
	.seh_endprologue
	mov	QWORD PTR 16[rbp], rcx
	mov	rax, QWORD PTR 16[rbp]
	mov	rax, QWORD PTR [rax]
	mov	rdx, QWORD PTR [rax]
	mov	rax, QWORD PTR 16[rbp]
	mov	rcx, rax
	call	rdx
	add	rsp, 32
	pop	rbp
	ret
	.seh_endproc
	.section	.text$_ZN4BaseD2Ev,"x"
	.linkonce discard
	.align 2
	.globl	"_ZN4BaseD2Ev"
	.def	"_ZN4BaseD2Ev";	.scl	2;	.type	32;	.endef
	.seh_proc	"_ZN4BaseD2Ev"
"_ZN4BaseD2Ev":
.LFB9:
	push	rbp
	.seh_pushreg	rbp
	mov	rbp, rsp
	.seh_setframe	rbp, 0
	.seh_endprologue
	mov	QWORD PTR 16[rbp], rcx
	lea	rdx, "_ZTV4Base"[rip+16]
	mov	rax, QWORD PTR 16[rbp]
	mov	QWORD PTR [rax], rdx
	nop
	pop	rbp
	ret
	.seh_endproc
	.section	.text$_ZN4BaseD1Ev,"x"
	.linkonce discard
	.align 2
	.globl	"_ZN4BaseD1Ev"
	.def	"_ZN4BaseD1Ev";	.scl	2;	.type	32;	.endef
	.seh_proc	"_ZN4BaseD1Ev"
"_ZN4BaseD1Ev":
.LFB10:
	push	rbp
	.seh_pushreg	rbp
	mov	rbp, rsp
	.seh_setframe	rbp, 0
	.seh_endprologue
	mov	QWORD PTR 16[rbp], rcx
	lea	rdx, "_ZTV4Base"[rip+16]
	mov	rax, QWORD PTR 16[rbp]
	mov	QWORD PTR [rax], rdx
	nop
	pop	rbp
	ret
	.seh_endproc
	.section	.text$_ZN4BaseD0Ev,"x"
	.linkonce discard
	.align 2
	.globl	"_ZN4BaseD0Ev"
	.def	"_ZN4BaseD0Ev";	.scl	2;	.type	32;	.endef
	.seh_proc	"_ZN4BaseD0Ev"
"_ZN4BaseD0Ev":
.LFB11:
	push	rbp
	.seh_pushreg	rbp
	mov	rbp, rsp
	.seh_setframe	rbp, 0
	sub	rsp, 32
	.seh_stackalloc	32
	.seh_endprologue
	mov	QWORD PTR 16[rbp], rcx
	mov	rax, QWORD PTR 16[rbp]
	mov	rcx, rax
	call	"_ZN4BaseD1Ev"
	mov	rax, QWORD PTR 16[rbp]
	mov	edx, 8
	mov	rcx, rax
	call	"_ZdlPvy"
	nop
	add	rsp, 32
	pop	rbp
	ret
	.seh_endproc
	.section	.text$_ZN7DerivedD1Ev,"x"
	.linkonce discard
	.align 2
	.globl	"_ZN7DerivedD1Ev"
	.def	"_ZN7DerivedD1Ev";	.scl	2;	.type	32;	.endef
	.seh_proc	"_ZN7DerivedD1Ev"
"_ZN7DerivedD1Ev":
.LFB16:
	push	rbp
	.seh_pushreg	rbp
	mov	rbp, rsp
	.seh_setframe	rbp, 0
	sub	rsp, 32
	.seh_stackalloc	32
	.seh_endprologue
	mov	QWORD PTR 16[rbp], rcx
	lea	rdx, "_ZTV7Derived"[rip+16]
	mov	rax, QWORD PTR 16[rbp]
	mov	QWORD PTR [rax], rdx
	mov	rax, QWORD PTR 16[rbp]
	mov	rcx, rax
	call	"_ZN4BaseD2Ev"
	nop
	add	rsp, 32
	pop	rbp
	ret
	.seh_endproc
	.section	.text$_ZN7DerivedD0Ev,"x"
	.linkonce discard
	.align 2
	.globl	"_ZN7DerivedD0Ev"
	.def	"_ZN7DerivedD0Ev";	.scl	2;	.type	32;	.endef
	.seh_proc	"_ZN7DerivedD0Ev"
"_ZN7DerivedD0Ev":
.LFB17:
	push	rbp
	.seh_pushreg	rbp
	mov	rbp, rsp
	.seh_setframe	rbp, 0
	sub	rsp, 32
	.seh_stackalloc	32
	.seh_endprologue
	mov	QWORD PTR 16[rbp], rcx
	mov	rax, QWORD PTR 16[rbp]
	mov	rcx, rax
	call	"_ZN7DerivedD1Ev"
	mov	rax, QWORD PTR 16[rbp]
	mov	edx, 8
	mov	rcx, rax
	call	"_ZdlPvy"
	nop
	add	rsp, 32
	pop	rbp
	ret
	.seh_endproc
	.text
	.globl	"_Z9callKnownv"
	.def	"_Z9callKnownv";	.scl	2;	.type	32;	.endef
	.seh_proc	"_Z9callKnownv"
"_Z9callKnownv":
.LFB3:
	push	rbp
	.seh_pushreg	rbp
	push	rbx
	.seh_pushreg	rbx
	sub	rsp, 56
	.seh_stackalloc	56
	lea	rbp, 48[rsp]
	.seh_setframe	rbp, 48
	.seh_endprologue
	lea	rax, "_ZTV7Derived"[rip+16]
	mov	QWORD PTR -16[rbp], rax
	lea	rax, -16[rbp]
	mov	QWORD PTR -8[rbp], rax
	mov	rax, QWORD PTR -8[rbp]
	mov	rax, QWORD PTR [rax]
	mov	rdx, QWORD PTR [rax]
	mov	rax, QWORD PTR -8[rbp]
	mov	rcx, rax
.LEHB0:
	call	rdx
.LEHE0:
	mov	ebx, eax
	nop
	lea	rax, -16[rbp]
	mov	rcx, rax
	call	"_ZN7DerivedD1Ev"
	mov	eax, ebx
	jmp	.L16
.L15:
	mov	rbx, rax
	lea	rax, -16[rbp]
	mov	rcx, rax
	call	"_ZN7DerivedD1Ev"
	mov	rax, rbx
	mov	rcx, rax
.LEHB1:
	call	"_Unwind_Resume"
.LEHE1:
.L16:
	add	rsp, 56
	pop	rbx
	pop	rbp
	ret
	.seh_handler	"__gxx_personality_seh0", @unwind, @except
	.seh_handlerdata
.LLSDA3:
	.byte	0xff
	.byte	0xff
	.byte	0x1
	.uleb128 .LLSDACSE3-.LLSDACSB3
.LLSDACSB3:
	.uleb128 .LEHB0-.LFB3
	.uleb128 .LEHE0-.LEHB0
	.uleb128 .L15-.LFB3
	.uleb128 0
	.uleb128 .LEHB1-.LFB3
	.uleb128 .LEHE1-.LEHB1
	.uleb128 0
	.uleb128 0
.LLSDACSE3:
	.text
	.seh_endproc
	.globl	"_ZTV7Derived"
	.section	.rdata$_ZTV7Derived,"dr"
	.linkonce same_size
	.align 8
"_ZTV7Derived":
	.quad	0
	.quad	"_ZTI7Derived"
	.quad	"_ZN7Derived9calculateEv"
	.quad	"_ZN7DerivedD1Ev"
	.quad	"_ZN7DerivedD0Ev"
	.globl	"_ZTV4Base"
	.section	.rdata$_ZTV4Base,"dr"
	.linkonce same_size
	.align 8
"_ZTV4Base":
	.quad	0
	.quad	"_ZTI4Base"
	.quad	"_ZN4Base9calculateEv"
	.quad	"_ZN4BaseD1Ev"
	.quad	"_ZN4BaseD0Ev"
	.globl	"_ZTI7Derived"
	.section	.rdata$_ZTI7Derived,"dr"
	.linkonce same_size
	.align 8
"_ZTI7Derived":
	.quad	"_ZTVN10__cxxabiv120__si_class_type_infoE"+16
	.quad	"_ZTS7Derived"
	.quad	"_ZTI4Base"
	.globl	"_ZTS7Derived"
	.section	.rdata$_ZTS7Derived,"dr"
	.linkonce same_size
	.align 8
"_ZTS7Derived":
	.ascii "7Derived\0"
	.globl	"_ZTI4Base"
	.section	.rdata$_ZTI4Base,"dr"
	.linkonce same_size
	.align 8
"_ZTI4Base":
	.quad	"_ZTVN10__cxxabiv117__class_type_infoE"+16
	.quad	"_ZTS4Base"
	.globl	"_ZTS4Base"
	.section	.rdata$_ZTS4Base,"dr"
	.linkonce same_size
"_ZTS4Base":
	.ascii "4Base\0"
	.def	"__gxx_personality_seh0";	.scl	2;	.type	32;	.endef
	.ident	"GCC: (MinGW-W64 x86_64-ucrt-posix-seh, built by Brecht Sanders, r4) 16.1.0"
	.def	"_ZdlPvy";	.scl	2;	.type	32;	.endef
	.def	"_Unwind_Resume";	.scl	2;	.type	32;	.endef
